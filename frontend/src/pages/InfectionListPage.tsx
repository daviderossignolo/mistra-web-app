import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Infection = {
	id: number;
	title: string;
	slug: string;
};

const InfectionList: React.FC = () => {
	const [pageData, setPageData] = useState<Infection[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchInfections = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					"http://localhost:1337/api/infection-pages",
				);
				if (!response.ok) {
					throw new Error("Failed to fetch infections");
				}
				const data = await response.json();
				setPageData(data.data as Infection[]);
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (err: any) {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				setError((err as any).message);
			} finally {
				setLoading(false);
			}
		};

		fetchInfections();
	}, []);

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Area live per i messaggi di caricamento/errore */}
			<div aria-live="polite" className="sr-only">
				{loading && "Caricamento..."}
				{error && `Errore: ${error}`}
				{!pageData && !loading && !error && "Nessun dato trovato"}
			</div>

			{loading && (
				<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
					<p className="text-lg text-gray-600">Caricamento...</p>
				</div>
			)}
			{error && (
				<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
					<p className="text-lg text-red-700" role="alert">
						Errore: {error}
					</p>
				</div>
			)}
			{!pageData && !loading && !error && (
				<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
					<p className="text-lg text-gray-600">Nessun dato trovato.</p>
				</div>
			)}

			{pageData && (
				<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
					{pageData.map((infection: Infection) => (
						<a
							key={infection.id}
							href={`/${infection.slug}`}
							className="border border-navbar rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer focus:outline-none focus:ring focus:ring-blue-500 block" // Aggiunto "block" per far occupare all'<a> tutto lo spazio del div
							aria-label={`Vai alla pagina di ${infection.title}`}
						>
							<div className="p-6">
								<h2 className="text-xl font-semibold font-poppins text-navbar-hover">
									{infection.title}
								</h2>
							</div>
						</a>
					))}
				</div>
			)}
		</div>
	);
};

export default InfectionList;
