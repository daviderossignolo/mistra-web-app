import type React from "react";
import { useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";

type ServicePageData = {
	id: number;
	documentId: string;
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	main_image: any;
	slug: string;
	title: string;
	moving_banner: string;
	content: {
		type: string;
		children: { type: string; text: string }[];
	}[];
};

const ServicePage: React.FC<{ slug: string }> = ({ slug }) => {
	const [pageData, setPageData] = useState<ServicePageData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					`http://localhost:1337/api/services-pages?filters[slug]=${slug}&populate=*`,
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
		const content = pageData.content;
		const mainImage = pageData.main_image;
		const banner = pageData.moving_banner;

		return (
			<div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
				<div className="w-full bg-navbar-hover px-4 py-4">
					<h2 className="text-white font-bold font-poppins m-0 text-center text-[42px]">
						Servizi Offerti
					</h2>
				</div>
				{banner && (
					<div className="w-full bg-yellow-300 px-4 py-2 overflow-hidden">
						<div className="animate-scroll whitespace-nowrap">
							<p className="text-red-600 font-bold inline-block">
								{`${banner} ${banner} ${banner}`}
							</p>
						</div>
					</div>
				)}
				<div className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover">
					<div className="flex gap-4">
						<div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 flex items-start pt-1">
							<img
								src={`http://localhost:1337${mainImage.url}`}
								alt={`${mainImage.alternativeText}`}
								className="w-24 h-24 md:w-32 md:h-32 object-contain"
							/>
						</div>

						<div className="flex-grow prose max-w-none text-navbar-hover font-poppins text-[17px]">
							<TextBlock content={content} />
						</div>
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

export default ServicePage;
