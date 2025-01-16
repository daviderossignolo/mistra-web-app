import type React from "react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import TextBlock from "../components/textBlock";

type PageData = {
	title: string;
	sections: Array<{
		content: {
			type: string;
			children: {
				type: string;
				text: string;
			}[];
		};
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		icon: any;
		id: number;
		title: string;
	}>;
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
				setPageData(data.data[0]);
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
			<div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
				<div className="w-full bg-navbar-hover px-4 py-4">
					<h2 className="text-white font-bold font-poppins m-0 text-center text-[42px]">
						{title}
					</h2>
				</div>
				<div className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover">
					{pageData.sections.map((section) => {
						return (
							<div key={section.id} className="w-full">
								<div className="flex gap-4">
									{section.icon && (
										<div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-start pt-1">
											<img
												src={`http://localhost:1337${section.icon.url}`}
												alt={`${section.icon.alternativeText} icon`}
												className="w-8 h-8 md:w-10 md:h-10 object-contain"
											/>
										</div>
									)}
									<div className="flex-grow prose max-w-none text-navbar-hover font-poppins text-[17px]">
										<h3 className="text-[24px] font-bold">{section.title}</h3>
										<TextBlock content={section.content} />
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}, [pageData]);

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg text-gray-600">Loading...</p>
			</div>
		);

	if (error)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg text-red-500">Error: {error}</p>
			</div>
		);

	if (!pageData)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-lg text-gray-600">No page data found</p>
			</div>
		);

	return (
		<div className="min-h-screen bg-gray-50 py-8 md:py-12">{renderBlocks}</div>
	);
};

export default InfectionPage;
