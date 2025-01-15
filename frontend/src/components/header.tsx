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
	lateral_logos: any;
	publishedAt: string;
	title: string;
	updatedAt: string;
};

const Header: React.FC = () => {
	const [headerData, setHeaderData] = useState<headerData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchHeaderData = async () => {
			const url =
				"http://localhost:1337/api/header?populate[0]=content.main_image&populate[1]=lateral_logos";
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
	}, []);

	// Recupero i dati ritornati dalla API per inizialiizzare le variabili che verranno utilizzate per la visualizzazione
	const lateral_logos = `http://localhost:1337${headerData?.lateral_logos.url}`;
	const lateral_logos_altertext = headerData?.lateral_logos.alternativeText;
	const header_title = headerData?.title;
	const main_image = `http://localhost:1337${headerData?.content.main_image.url}`;
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
	if (error) return <div className="p-4 text-red-500">Errore: {error}</div>;

	return (
		<header className="w-full bg-navbar shadow-md">
			{/* Barra in alto iniziale dell'header */}
			<div className="container mx-auto px-4 py-2 relative">
				{/* Immagini laterali, loghi ospedale */}
				<img
					src={lateral_logos}
					alt={lateral_logos_altertext}
					className="absolute top-4 left-4 md:left-40 h-12 w-12 object-contain rounded-full"
				/>
				<img
					src={lateral_logos}
					alt={lateral_logos_altertext}
					className="absolute top-4 right-4 md:right-40 h-12 w-12 object-contain rounded-full"
				/>
				{/* Titolo */}
				<h1 className="text-center text-lg md:text-2xl font-bold py-4 text-white px-16">
					{header_title}
				</h1>
			</div>
			{/* Sezione con immagine e titolo */}
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
					<div className="flex flex-col space-y-4 text-center md:text-left">
						<div className="space-y-2">
							<ReactMarkdown
								className="text-white prose prose-invert"
								components={{
									h2: ({ node, ...props }) => (
										<h2
											className="mb-4 text-4xl font-poppins font-extralight"
											{...props}
										/>
									),
									p: ({ node, ...props }) => (
										<p
											className="mb-2 text-3xl font-poppins font-extralight"
											{...props}
										/>
									),
								}}
							>
								{parsedMarkdown}
							</ReactMarkdown>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
