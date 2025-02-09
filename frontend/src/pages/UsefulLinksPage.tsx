import { type Key, useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";

type LinkType = {
	id: number;
	description: string;
	url: string;
};

type ResourceType = {
	id: number;
	content: {
		type: string;
		children: {
			type: string;
			text: string;
		}[];
	}[];
	links: LinkType[];
};

type SectionType = {
	id: number;
	title: string;
	resource: ResourceType[];
};

type UsefulLinkData = {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	section: SectionType[];
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
};

const UsefulLinksPage: React.FC = () => {
	const [pageData, setPageData] = useState<UsefulLinkData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					"http://localhost:1337/api/useful-link?pLevel",
				);
				if (!response.ok) {
					throw new Error("Error while loading data");
				}

				const data = await response.json();
				setPageData(data.data as UsefulLinkData);
			} catch (err: unknown) {
				// Handle error properly
				const errorMessage =
					err instanceof Error ? err.message : "Something went wrong";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchPageData();
	}, []);

	const renderBlocks = useMemo(() => {
		if (!pageData) return null;

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
				{pageData.section.map((section) => (
					<section
						key={section.id}
						aria-labelledby={`sectionTitle-${section.id}`}
						className="w-full max-w-3xl mx-auto flex flex-col gap-4"
					>
						<div className="w-full bg-navbar-hover px-4 py-4">
							<h2
								id={`sectionTitle-${section.id}`}
								className="m-0 text-center text-[42px] font-bold font-poppins text-white"
							>
								{section.title}
							</h2>
						</div>
						<div className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover">
							{section.resource?.map((resource, index) => (
								<div
									key={resource.id}
									className="w-full flex flex-col gap-4"
									aria-labelledby={`resourceTitle-${resource.id}`}
								>
									<TextBlock content={resource.content} />
									<div className="w-full">
										<div
											className={`grid gap-6 ${
												resource.links.length === 1
													? "grid-cols-1 items-center"
													: "grid-cols-1 md:grid-cols-2"
											}`}
										>
											{resource.links.map((link) => (
												<div
													key={link.id}
													className="flex flex-col gap-2 pb-4"
												>
													{/* Description */}
													<p
														className={`text-lg font-poppins text-navbar-hover mb-2 ${
															link.description ? "text-left" : "sr-only"
														}`} // sr-only per nascondere se non c'è descrizione
													>
														{link.description || "Placeholder"}{" "}
														{/* For alignment */}
													</p>

													<iframe
														width="100%"
														height="315"
														src={
															link.url.includes("youtube.com")
																? link.url.replace("watch?v=", "embed/")
																: link.url
														} // Convert YouTube URL to an embed URL if necessary
														title={
															link.description || `Video da ${link.url}`
														} // Titolo descrittivo per l'iframe
														allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
														allowFullScreen
														className="w-full rounded-md shadow-md"
													/>
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</section>
				))}
			</div>
		);
	}, [pageData]);

	return (
		<div className="min-h-screen bg-gray-50 py-8 md:py-12">
			{renderBlocks}
		</div>
	);
};

export default UsefulLinksPage;