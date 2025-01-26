import { type Key, useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";

type EventPageData = {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	sections: {
		id: number;
		title: string;
		section_block: {
			id: number;
			moving_banner: string;
			content: {
				type: string;
				children: {
					type: string;
					text: string;
				}[];
			};
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			images: { id: number; image: any }[];
		}[];
	}[];
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
};

const EventsPage: React.FC = () => {
	const [pageData, setPageData] = useState<EventPageData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch("http://localhost:1337/api/event?pLevel");

				if (!response.ok) {
					throw new Error("Errore durante il caricamento dei dati");
				}

				// setto i dati ottenuti dalla chiamata nella variabile pageData
				const data = await response.json();
				console.log(data);
				setPageData(data.data);
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (err: any) {
				// se c'è un errore, lo setto nella variabile error
				setError(err.message);
			} finally {
				// ho finito, setto il loading a false
				setLoading(false);
			}
		};
		fetchPageData();
	}, []);

	// funzione utilizzata per renderizzare i blocchi ottenuti dalla chiamata a strapi, usa memo per evitare di ricalcolare il render ad ogni renderizzazione
	const renderBlocks = useMemo(() => {
		if (!pageData) return null;

		const sections = pageData.sections;
		console.log(sections);

		return (
			<div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
				{sections.map((section) => (
					<div key={section.id}>
						<div className="w-full bg-navbar-hover px-4 py-4">
							<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
								{section.title}
							</h2>
						</div>

						{section.section_block?.map((block) => (
							<div
								key={block.id}
								className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover"
							>
								{block.content !== null && (
									<TextBlock content={block.content} />
								)}

								{block.images?.length > 0 && (
									<div className="grid grid-cols-3 gap-4 py-4">
										{block.images.map((img) => (
											<img
												key={img.image.id}
												src={`http://localhost:1337${img.image.url}`}
												alt={img.image.alternativeText}
												className="w-full h-auto"
											/>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				))}
			</div>
		);
	}, [pageData]);

	if (loading) return <p className="text-center p-4">Loading...</p>;
	if (error)
		return <p className="text-center p-4 text-red-500">Error: {error}</p>;
	if (!pageData) return <p className="text-center p-4">No page data found</p>;

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			{renderBlocks}
		</div>
	);
};

export default EventsPage;
