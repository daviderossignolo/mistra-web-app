import type React from "react";
import { useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";

type UsefulLinkData = {
	id: number;
	title: string;
	slug: string;
	documentId: string;
	section: {
		id: number;
		title: string;
		resource: {
			id: number;
			content: {
				type: string;
				children: {
					type: string;
					text: string;
				}[];
			}[];
			links: {
				id: number;
				description: string;
				url: string;
			}[];
		}[];
	}[];
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
};

const UsefulLinksPage: React.FC = () => {
	const [pageData, setPageData] = useState<UsefulLinkData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					"http://localhost:1337/api/useful-link?pLevel",
				);
				if (!response.ok) {
					throw new Error("Error while loading data");
				}

				const data = await response.json();
				setPageData(data.data);
			} catch (err: unknown) {
				// Handle error properly
				const errorMessage =
					err instanceof Error ? err.message : "Something went wrong";
				setError(errorMessage);
			} finally {
				setLoading(false);
			}
		};

		fetchPageData();
	}, []);

	const renderBlocks = useMemo(() => {
		if (!pageData) return null;

		return pageData.section.map((section) => (
			<div
				key={section.id}
				className="w-full max-w-3xl mx-auto flex flex-col gap-4"
			>
				<div className="w-full bg-navbar-hover px-4 py-4">
					<h2 className="text-white font-bold font-poppins m-0 text-center text-[42px]">
						{section.title}
					</h2>
				</div>

				<div className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover">
					{/* Check if the resource has links */}
					{section.resource?.map((resource, index) => (
						<div key={resource.id} className="w-full flex flex-col gap-4">
							{/* Content of the resource */}
							<TextBlock content={resource.content} />

							<div className="w-full">
								{/* 2-column grid for YouTube and other videos */}
								<div
									className={`grid gap-6 ${
										resource.links.length === 1
											? "grid-cols-1 items-center"
											: "grid-cols-1 md:grid-cols-2"
									}`}
								>
									{resource.links.map((link) => (
										<div key={link.id} className="flex flex-col gap-2 pb-4">
											{/* Description */}
											<p
												className={`text-lg font-poppins text-navbar-hover mb-2 ${
													link.description ? "text-left" : "invisible"
												}`}
											>
												{link.description || "Placeholder"}{" "}
												{/* For alignment */}
											</p>

											{/* Video (YouTube or other) */}
											<iframe
												width="100%"
												height="315"
												src={
													link.url.includes("youtube.com")
														? link.url.replace("watch?v=", "embed/")
														: link.url
												} // Convert YouTube URL to an embed URL if necessary
												title={link.description || "Video"}
												allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												allowFullScreen
												className="w-full rounded-md shadow-md"
											/>
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		));
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

export default UsefulLinksPage;
