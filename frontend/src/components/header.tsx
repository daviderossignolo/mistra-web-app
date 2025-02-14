import type React from "react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type headerData = {
	content: {
		id: number;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		main_image: any;
		text_content: string;
	};
	createdAt: string;
	documentId: string;
	id: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	sx_logo: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	dx_logo: any;
	publishedAt: string;
	title: string;
	updatedAt: string;
};

const Header: React.FC = () => {
	const [headerData, setHeaderData] = useState<headerData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const host = process.env.REACT_APP_BACKEND_HOST;
	const port = process.env.REACT_APP_BACKEND_PORT;

	useEffect(() => {
		const fetchHeaderData = async () => {
			const url = `${host}:${port}/api/header?pLevel`;
			try {
				const response = await fetch(url);

				// se ho un errore nella risposta lancio un errore
				if (!response.ok) {
					throw new Error(`Errore nella richiesta: ${response.status}`);
				}

				const data = await response.json();
				setHeaderData(data.data);
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				setError(
					error.message || "Si è verificato un errore durante il fetch.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchHeaderData();
	}, [host, port]);

	// Recupero i dati ritornati dalla API per inizialiizzare le variabili che verranno utilizzate per la visualizzazione
	const sx_logo = `${host}:${port}${headerData?.sx_logo.url}`;
	const sx_logo_altertext = headerData?.sx_logo.alternativeText;
	const dx_logo = `${host}:${port}${headerData?.dx_logo.url}`;
	const dx_logo_altertext = headerData?.dx_logo.alternativeText;
	const header_title = headerData?.title;
	const main_image = `${host}:${port}${headerData?.content.main_image.url}`;
	const main_altertext = headerData?.content.main_image.alternativeText;

	// Funzione che formatta il markdown per la visualizzazione degli a capo
	const formatMarkdownContent = (content: string) => {
		const lines = content
			.split("\n")
			.map((line) => line.trim())
			.filter(Boolean);

		return `${lines[0]}\n\n${lines.slice(1).join("\n\n")}`;
	};

	// Contenuto markdown da visualizzare
	const parsedMarkdown = headerData?.content.text_content
		? formatMarkdownContent(headerData.content.text_content)
		: "";

	if (loading) return <div className="p-4 text-center">Caricamento...</div>;
	if (error) return <div className="p-4 text-red-700">Errore: {error}</div>;

	return (
		<header className="w-full bg-navbar shadow-md">
			<div className=" container mx-auto py-2 relative flex flex-col items-center md:flex-row md:justify-between">
				<img
					src={sx_logo}
					alt={sx_logo_altertext}
					className="h-12 w-12 md:h-16 md:w-16 object-contain rounded-full mx-2"
				/>
				{/* Titolo */}
				<h1 className="text-center text-lg md:text-2xl font-accessible-font font-bold py-4 text-white px-2">
					{header_title}
				</h1>
				<img
					src={dx_logo}
					alt={dx_logo_altertext}
					className="h-12 w-12 md:h-16 md:w-16 object-contain rounded-full mx-2"
				/>
			</div>
			<div className="container mx-auto px-4 py-6">
				<div className="max-w-4xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-1 items-center md:items-start">
					{/* Immagine principale */}
					<div className="flex justify-center">
						<img
							src={main_image}
							alt={main_altertext}
							className="h-48 w-48 md:h-64 md:w-64 object-cover rounded-full shadow-md"
						/>
					</div>

					{/* Contenuto testuale */}
					<section
						className="flex flex-col space-y-4 text-center md:text-left"
						aria-live="polite"
						aria-label="Contenuto testuale principale"
					>
						<div className="space-y-2">
							<ReactMarkdown
								className="text-white prose prose-invert"
								components={{
									h2: ({ node, ...props }) => (
										<h2
											className="mb-4 text-4xl font-accessible-font font-extralight"
											{...props}
										/>
									),
									p: ({ node, ...props }) => (
										<p
											className="mb-2 text-3xl font-accessible-font font-extralight"
											{...props}
										/>
									),
								}}
							>
								{parsedMarkdown}
							</ReactMarkdown>
						</div>
					</section>
				</div>
			</div>
		</header>
	);
};

export default Header;
