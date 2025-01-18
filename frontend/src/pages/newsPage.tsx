import type React from "react";
import { useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";

type NewsPageData = {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	main_image: any;
	section: sectionType[];
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
};

type sectionType = {
	id: number;
	title: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	qrcode: any;
	content: {
		type: string;
		children: {
			type: string;
			text: string;
		}[];
	}[];
};

const NewsPage: React.FC<{ slug: string }> = ({ slug }) => {
	const [pageData, setPageData] = useState<NewsPageData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					`http://localhost:1337/api/news-pages?filters[slug][$eq]=${slug}&pLevel`,
				);
				if (!response.ok) {
					throw new Error("Errore durante il caricamento dei dati");
				}

				const data = await response.json();
				console.log(data);
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
		const section = pageData.section;
		const mainImage = pageData.main_image;

		return (
			<div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
				<div className="w-full bg-navbar-hover px-4 py-4">
					<h2 className="text-white font-bold font-poppins m-0 text-center text-[42px]">
						{title}
					</h2>
				</div>
				<div className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover">
					<div className="flex gap-4">
						{mainImage && (
							<div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 flex items-start pt-1 pb-1">
								<img
									src={`http://localhost:1337${mainImage.url}`}
									alt={`${mainImage.alternativeText} icon`}
									className="w-24 h-24 md:w-32 md:h-32 object-contain"
								/>
							</div>
						)}
						{section?.map((section: sectionType) => {
							return (
								<div
									key={section.id}
									className="flex-grow prose max-w-none text-navbar-hover font-poppins text-[17px] mt-4"
								>
									<h3 className="text-[24px] font-bold">{section.title}</h3>
									<TextBlock content={section.content} />
									{section.qrcode && (
										<img
											src={`http://localhost:1337${section.qrcode.url}`}
											alt={`${section.qrcode.alternativeText} icon`}
											className="w-24 h-24 md:w-32 md:h-32 object-contain"
										/>
									)}
								</div>
							);
						})}
					</div>
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

export default NewsPage;
