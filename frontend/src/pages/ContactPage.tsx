import { useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";
import MapBlock from "../components/mapBlock";
import "../styles/contactPage.css";
import { formatTime } from "../utils";

type ContactPageProps = {
	slug: string;
};

type PageData = {
	title: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	pageContent: any[];
};

type hoursBlock = {
	id: number;
	Day: string;
	morningOpening: string;
	morningClosing: string;
	afternoonOpening: string;
	afternoonClosing: string;
	note: string;
};

// Definisco il functional component ContactPage che rappresenta la pagina dei contatti
// Il componente viene utilizzato per renderizzare la pagina dei contatti.
const ContactPage: React.FC<ContactPageProps> = ({ slug }) => {
	const [pageData, setPageData] = useState<PageData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	// console.log('Page data:', pageData);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					`http://localhost:1337/api/pages?filters[slug][$eq]=${slug}&populate[pageContent][populate]=*`,
				);
				if (!response.ok) {
					throw new Error("Errore durante il caricamento dei dati");
				}

				const data = await response.json();
				console.log("Data:", data);
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
		console.log("Page data:", pageData);
		if (!pageData) return null;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return pageData.pageContent.map((block: any, index: number) => {
			switch (block.__component) {
				case "page-block.text-block":
					return (
						<div key={block.id} className="contact-hero">
							<TextBlock content={block.content} />
						</div>
					);
				case "page-block.map-block":
					return (
						<div>
							<MapBlock
								description={block.description}
								city={block.city}
								address={block.address}
								latitude={block.latitude}
								longitude={block.longitude}
								cap={block.cap}
							/>
						</div>
					);
				case "page-block.opening-hours": {
					const openingHours = block.hours.map((hour: hoursBlock) => {
						console.log("Hour:", hour);
						return (
							// <p key={hour.id}>{hour.Day}: {formatTime(hour.morningOpening)} {format</p
							<div key={hour.id} className="table-row">
								<div className="cell">{hour.Day}</div>
								<div className="cell">
									{formatTime(hour.morningOpening)} -{" "}
									{formatTime(hour.morningClosing)}
								</div>
								<div className="cell">
									{formatTime(hour.afternoonOpening)} -{" "}
									{formatTime(hour.afternoonClosing)}
								</div>
							</div>
						);
					});
					return (
						<div className="orari-container">
							<h2 className="title">ORARI</h2>
							<p className="description">
								Le visite del Centro MISTRA hanno durata di 30 minuti e sono
								erogabili nelle seguenti fasce orarie (previa prenotazione):
							</p>
							<div className="table">
								<div className="table-header">
									<div className="header-day" />
									<div className="header-time">Mattina</div>
									<div className="header-time">Pomeriggio</div>
								</div>
								{openingHours}
							</div>
						</div>
					);
				}
				default:
					return null;
			}
		});
	}, [pageData]);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;
	if (!pageData) return <p>No page data found</p>;

	return <div className="contact-page-content">{renderBlocks}</div>;
};

export default ContactPage;
