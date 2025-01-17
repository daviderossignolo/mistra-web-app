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

const ServicesListPage: React.FC = () => {
	const [pageData, setPageData] = useState<any | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					"http://localhost:1337/api/services-pages?populate=*",
				);
				if (!response.ok) {
					throw new Error("Errore durante il caricamento dei dati");
				}

				const data = await response.json();
				console.log(data);
				setPageData(data.data);
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (err: any) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPageData();
	}, []);

	const renderBlocks = useMemo(() => {
		if (!pageData) return null;

		return (
			<div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
				<div className="w-full bg-navbar-hover px-4 py-4">
					<h2 className="text-white font-bold font-poppins m-0 text-center text-[42px]">
						Servizi Offerti
					</h2>
				</div>
				{pageData?.map((page: ServicePageData) => {
					const title = page.title;
					const image_url = page.main_image.url;
					const image_alt = page.main_image.alternativeText;
					return (
						<div
							key={page.id}
							className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover"
						>
							<div className="flex gap-4">
								<div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 flex items-start pt-1">
									<img
										src={`http://localhost:1337${image_url}`}
										alt={`${image_alt}`}
										className="w-24 h-24 md:w-32 md:h-32 object-contain"
									/>
								</div>

								<div className="flex-grow prose max-w-none text-white font-poppins text-[24px] bg-navbar-hover flex items-center justify-center">
									<a
										href={`/${page.slug}`}
										className="text-white no-underline hover:text-services-hover"
									>
										{page.title}
									</a>
								</div>
							</div>
						</div>
					);
				})}
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

export default ServicesListPage;
