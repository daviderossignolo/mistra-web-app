import type React from "react";
import { useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";

type Section = {
	content: {
		type: string;
		children: {
			type: string;
			text: string;
		}[];
	};
	icon: {
		url: string;
	} | null;
	id: number;
	title: string;
};

type PageData = {
	title: string;
	sections: Section[];
	id: number;
	slug: string;
	updatedAt: string;
	publishedAt: string;
	createdAt: string;
	documentId: string;
};

const InfectionPage: React.FC<{ slug: string }> = ({ slug }) => {
	const [pageData, setPageData] = useState<PageData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					`http://localhost:1337/api/infection-pages?filters[slug]=${slug}&populate[sections][populate]=*`,
				);
				if (!response.ok) {
					throw new Error("Errore durante il caricamento dei dati");
				}

				const data = await response.json();
				setPageData(data.data[0] as PageData);
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPageData();
	}, [slug]);

	const renderBlocks = useMemo(() => {
		if (!pageData) return null;

		const title = pageData.title;

		return (
			<div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
				<div
					className="w-full bg-navbar-hover px-4 py-4"
					aria-labelledby="pageTitle"
				>
					<h2
						id="pageTitle"
						className="m-0 text-center text-[42px] font-bold font-accesible-font text-white"
					>
						{title}
					</h2>
				</div>

				<div
					className="w-full text-left text-lg font-accesible-font font-extralight text-navbar-hover"
					role="group"
					aria-labelledby="sectionsTitle"
				>
					<h3 id="sectionsTitle" className="sr-only">
						Sezioni
					</h3>
					{pageData.sections.map((section) => (
						<section
							key={section.id}
							className="w-full mb-4"
							aria-labelledby={`sectionTitle-${section.id}`}
						>
							<div className="flex gap-4">
								{section.icon && (
									<div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-start pt-1">
										<img
											src={`http://localhost:1337${section.icon.url}`}
											alt={"Icona sezione: " + section.title}
											className="w-8 h-8 md:w-10 md:h-10 object-contain"
											aria-hidden={true} // L'icona è puramente decorativa
										/>
									</div>
								)}
								<div className="flex-grow prose max-w-none text-navbar-hover font-accesible-font text-[17px]">
									<h4
										className="text-[24px] font-bold"
										id={`sectionTitle-${section.id}`}
									>
										{section.title}
									</h4>
									<TextBlock content={section.content} />
								</div>
							</div>
						</section>
					))}
				</div>
			</div>
		);
	}, [pageData]);

	return (
		<div className="min-h-screen bg-gray-50 py-8 md:py-12">
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
			{renderBlocks}
		</div>
	);
};

export default InfectionPage;
