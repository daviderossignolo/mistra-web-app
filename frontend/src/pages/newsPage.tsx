import type React from "react";
import { useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";

type QrcodeType = {
	url: string;
	alternativeText: string;
};

type sectionType = {
	id: number;
	title: string;
	qrcode: QrcodeType | null;
	content: {
		type: string;
		children: {
			type: string;
			text: string;
		}[];
	}[];
};

type NewsPageData = {
	id: number;
	documentId: string;
	title: string;
	slug: string;
	main_image: {
		url: string;
	} | null;
	section: sectionType[];
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
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
				setPageData(data.data[0] as NewsPageData);
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
				{/* Intestazione della pagina */}
				<div className="w-full bg-navbar-hover px-4 py-4">
					<h1 className="m-0 text-center text-[42px] font-bold font-poppins text-white">
						{title}
					</h1>
				</div>
				{/* Contenuto principale */}
				<div className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover">
					<div className="flex gap-4">
						{/* Immagine principale */}
						{mainImage && (
							<div className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 flex items-start pt-1 pb-1">
								<img
									src={`http://localhost:1337${mainImage.url}`}
									alt={"Immagine principale della news " + title}
									className="w-24 h-24 md:w-32 md:h-32 object-contain"
								/>
							</div>
						)}
						{/* Sezioni */}
						{section?.map((section: sectionType) => (
							<section
								key={section.id}
								aria-labelledby={`sectionTitle-${section.id}`}
								className="flex-grow prose max-w-none text-navbar-hover font-poppins text-[17px] mt-4"
							>
								{/* Intestazione della sezione */}
								<h2
									id={`sectionTitle-${section.id}`}
									className="text-[24px] font-bold"
								>
									{section.title}
								</h2>
								{/* Contenuto della sezione */}
								<TextBlock content={section.content} />
								{/* Immagine QR code */}
								{section.qrcode && (
									<img
										src={`http://localhost:1337${section.qrcode.url}`}
										alt={section.qrcode.alternativeText ? section.qrcode.alternativeText : "QR code della sezione"}
										className="w-24 h-24 md:w-32 md:h-32 object-contain"
									/>
								)}
							</section>
						))}
					</div>
				</div>
			</div>
		);
	}, [pageData]);

	return (
		<div className="min-h-screen bg-gray-50 py-8 md:py-12">{renderBlocks}</div>
	);
};

export default NewsPage;