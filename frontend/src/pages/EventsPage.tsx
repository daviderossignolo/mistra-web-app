import { type Key, useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";

type ImageType = {
	id: number;
	image: {
		url: string;
		alternativeText: string;
	};
};

type SectionBlockType = {
	id: number;
	moving_banner: string;
	content: {
		type: string;
		children: {
			type: string;
			text: string;
		}[];
	};
	images: ImageType[];
};

type SectionType = {
	id: number;
	title: string;
	section_block: SectionBlockType[];
};

type EventPageData = {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	sections: SectionType[];
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
				setPageData(data.data as EventPageData);
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

		return (
			<div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
				{/* Area live per i messaggi di caricamento/errore */}
				<div aria-live="polite" className="sr-only">
					{loading && "Caricamento..."}
					{error && `Errore: ${error}`}
					{!pageData && !loading && !error && "Nessun dato trovato"}
				</div>

				{loading && (
					<div className="min-h-screen flex items-center justify-center">
						<p className="text-lg text-gray-600">Caricamento...</p>
					</div>
				)}
				{error && (
					<div className="min-h-screen flex items-center justify-center">
						<p className="text-lg text-red-700" role="alert">
							Errore: {error}
						</p>
					</div>
				)}
				{!pageData && !loading && !error && (
					<div className="min-h-screen flex items-center justify-center">
						<p className="text-lg text-gray-600">Nessun dato trovato</p>
					</div>
				)}
				{sections.map((section) => (
					<section
						key={section.id}
						aria-labelledby={`sectionTitle-${section.id}`}
					>
						<div className="w-full bg-navbar-hover px-4 py-4">
							<h2
								id={`sectionTitle-${section.id}`}
								className="m-0 text-left text-[42px] font-bold font-accesible-font text-white"
							>
								{section.title}
							</h2>
						</div>

						{section.section_block?.map((block) => (
							<div
								key={block.id}
								className="w-full text-left text-lg font-accesible-font font-extralight text-navbar-hover"
							>
								{block.content !== null && (
									<TextBlock content={block.content} />
								)}

								{block.images?.length > 0 && (
									<div className="grid grid-cols-3 gap-4 py-4">
										{block.images.map((img) => (
											<img
												key={img.image.url}
												src={`http://localhost:1337${img.image.url}`}
												alt={
													img.image.alternativeText
														? img.image.alternativeText
														: "Immagine dell'evento"
												}
												className="w-full h-auto"
											/>
										))}
									</div>
								)}
							</div>
						))}
					</section>
				))}
			</div>
		);
	}, [pageData, error, loading]);

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			{renderBlocks}
		</div>
	);
};

export default EventsPage;
