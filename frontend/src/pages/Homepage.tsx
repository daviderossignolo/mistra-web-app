import type React from "react";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import TextBlock from "../components/textBlock";

type PageData = {
	title: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	content: any[];
};

const Homepage: React.FC = () => {
	const [pageData, setPageData] = useState<PageData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					"http://localhost:1337/api/home?populate=*",
				);
				if (!response.ok) {
					throw new Error("Errore durante il caricamento dei dati");
				}

				const data = await response.json();
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

		const title = pageData.title;
		const content = pageData.content;

		return (
			<div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
				<div className="w-full bg-navbar-hover px-4 py-4">
					<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
						{title}
					</h2>
				</div>
				<div className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover">
					<TextBlock content={content} />
				</div>
			</div>
		);
	}, [pageData]);

	if (loading) return <p className="text-center p-4">Loading...</p>;
	if (error)
		return <p className="text-center p-4 text-red-500">Error: {error}</p>;
	if (!pageData) return <p className="text-center p-4">No page data found</p>;

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
			{renderBlocks}
		</div>
	);
};

export default Homepage;
