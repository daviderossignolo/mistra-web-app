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

const ServicesListPage: React.FC = () => {
	const [pageData, setPageData] = useState<ServicePageData[] | null>(null);
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
				setPageData(data.data as ServicePageData[]);
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
			<div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
				<div className="w-full bg-navbar-hover px-4 py-4">
					<h2 className="m-0 text-center text-[42px] font-bold font-poppins text-white">
						Servizi Offerti
					</h2>
				</div>

				<ul
					className="flex flex-col gap-4"
					aria-labelledby="servicesListHeading"
				>
					{pageData?.map((page: ServicePageData) => {
						const title = page.title;
						const image_url = page.main_image.url;
						return (
							<li
								key={page.id}
								className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover"
							>
								<div className="flex gap-4">
									<div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 flex items-start pt-1">
										<img
											src={`http://localhost:1337${image_url}`}
											alt={`Immagine del servizio ${title}`}
											className="w-24 h-24 md:w-32 md:h-32 object-contain"
											aria-hidden={true} // Immagine decorativa
										/>
									</div>

									<div className="flex-grow prose max-w-none text-white font-poppins text-[24px] bg-navbar-hover flex items-center justify-center">
										<a
											href={`/${page.slug}`}
											className="text-white no-underline hover:text-services-hover"
											aria-label={`Vai alla pagina del servizio ${title}`}
										>
											{page.title}
										</a>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
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

export default ServicesListPage;
