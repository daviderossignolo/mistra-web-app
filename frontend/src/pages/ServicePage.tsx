import type React from "react";
import { useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";

type ServicePageData = {
	id: number;
	documentId: string;
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
	main_image: {
		url: string;
	};
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
				setPageData(data.data[0] as ServicePageData);
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
			<div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
				<div
					className="w-full bg-navbar-hover px-4 py-4"
					aria-labelledby="pageTitle"
				>
					<h2
						id="pageTitle"
						className="m-0 text-center text-[42px] font-bold font-poppins text-white"
					>
						{title}
					</h2>
				</div>

				{banner && (
					<div
						className="w-full bg-yellow-300 px-4 py-2 overflow-hidden"
						aria-label={`Banner scorrevole: ${banner}`}
					>
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
								alt={`Immagine del servizio ${title}`}
								className="w-24 h-24 md:w-32 md:h-32 object-contain"
								aria-hidden={true} //Nascondo l'immagine in quanto puramente decorativa
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

export default ServicePage;
