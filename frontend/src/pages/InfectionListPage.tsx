import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InfectionList: React.FC = () => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [pageData, setPageData] = useState<any | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchInfections = async () => {
			try {
				const response = await fetch(
					"http://localhost:1337/api/infection-pages",
				);
				if (!response.ok) {
					throw new Error("Failed to fetch infections");
				}
				const data = await response.json();
				console.log(data);
				setPageData(data.data);
			} catch (err) {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				setError((err as any).message);
			} finally {
				setLoading(false);
			}
		};

		fetchInfections();
	}, []);

	if (loading)
		return (
			<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
				<p className="text-lg text-gray-600">Loading...</p>
			</div>
		);

	if (error)
		return (
			<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
				<p className="text-lg text-red-500">Error: {error}</p>
			</div>
		);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
				{pageData.map((infection: any) => (
					<button
						key={infection.id}
						type="button"
						className="border border-navbar rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer focus:outline-none focus:ring focus:ring-blue-500"
						onClick={() => navigate(`/${infection.slug}`)}
					>
						<div className="p-6">
							<h2 className="text-xl font-semibold font-poppins text-navbar-hover">
								{infection.title}
							</h2>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default InfectionList;
