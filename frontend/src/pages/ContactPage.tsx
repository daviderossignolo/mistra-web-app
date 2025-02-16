import { useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";
import MapBlock from "../components/mapBlock";
import { formatTime } from "../utils";

type ContactPageData = {
	id: number;
	title: string;
	slug: string;
	documentId: string;
	introduction: {
		id: number;
		title: string;
		content: {
			type: string;
			children: { type: string; text: string }[];
		}[];
	};
	info: {
		id: number;
		title: string;
		content: {
			type: string;
			children: { type: string; text: string }[];
		}[];
	};
	map: {
		id: number;
		title: string;
		latitude: number;
		longitude: number;
		city: string;
		address: string;
		cap: string;
		content: {
			type: string;
			children: { type: string; text: string }[];
		}[];
	};
	openingHours: {
		id: number;
		title: string;
		description: string;
		hour: {
			id: number;
			day: string;
			morningOpening: string;
			morningClosing: string;
			afternoonOpening: string;
			afternoonClosing: string;
			note: string;
		}[];
	};
	action: {
		id: number;
		title: string;
		url: string;
		content: {
			type: string;
			children: { type: string; text: string }[];
		}[];
	};
	createdAt: string;
	publishedAt: string;
	updatedAt: string;
};

const ContactPage: React.FC = () => {
	const [pageData, setPageData] = useState<ContactPageData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(
					"http://localhost:1337/api/contact?populate[0]=introduction&populate[1]=openingHours.hour&populate[2]=map&populate[3]=info&populate[4]=action",
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
		const introduction = pageData.introduction;
		const map = pageData.map;
		const openingHours = pageData.openingHours;
		const info = pageData.info;
		const action = pageData.action;

		return (
			<div className="flex flex-col gap-12">
				<div className="w-full bg-navbar-hover px-4 py-6">
					<h1 className="text-white font-bold font-accesible-font m-0 text-left text-3xl md:text-4xl lg:text-5xl container mx-auto">
						{title}
					</h1>
				</div>
				<div
					className="w-full bg-contact-bg py-5"
					aria-labelledby="introductionTitle"
				>
					<div className="container mx-auto max-w-5xl px-4">
						<h2 className="text-center text-red-700 font-bold font-accesible-font text-[56px]">
							{introduction.title}
						</h2>
						<div className="text-left font-accesible-font font-extralight text-navbar-hover text-[20px]">
							<TextBlock content={introduction.content} />
						</div>
					</div>
				</div>
				<div
					className="container mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
					aria-labelledby="mapSectionTitle"
				>
					<div className="flex flex-col gap-4">
						<h2 className="font-accesible-font font-bold text-navbar-hover text-[35px]">
							{map.title}
						</h2>
						<div className="font-accesible-font text-navbar-hover">
							<TextBlock content={map.content} />
						</div>
					</div>
					<div>
						<div aria-label="Map">
							<MapBlock latitude={map.latitude} longitude={map.longitude} />
						</div>
					</div>
				</div>
				<div
					className="w-full bg-contact-bg py-8"
					aria-labelledby="openingHoursTitle"
				>
					<div className="container mx-auto max-w-5xl px-4">
						<h2 className="text-center text-[35px] font-accesible-font mb-4 text-navbar-hover">
							{openingHours.title}
						</h2>
						<hr className="border-2 border-navbar-hover mx-auto mb-4" />
						<p className="text-base text-[20px] font-accesible-font font-extralight text-navbar-hover py-1 mb-4">
							{openingHours.description}
						</p>
						<div className="overflow-x-auto">
							<table className="w-full text-center" summary="Orari di apertura">
								<thead>
									<tr>
										<th className="py-2 px-2" scope="col">
											Giorno
										</th>
										<th className="py-2 px-2" scope="col">
											Mattino
										</th>
										<th className="py-2 px-2" scope="col">
											Pomeriggio
										</th>
										{/*<th className="py-2 px-4">Note</th>*/}
									</tr>
								</thead>
								<tbody>
									{openingHours.hour.map((day) => (
										<tr key={day.id}>
											<td className="py-2 px-2">{day.day}</td>
											<td className="py-2 px-2">
												{formatTime(day.morningOpening)} -{" "}
												{formatTime(day.morningClosing)}
											</td>
											<td className="py-2 px-2">
												{formatTime(day.afternoonOpening)} -{" "}
												{formatTime(day.afternoonClosing)}
											</td>
											{/*<td className="py-2 px-4">{day.note}</td>*/}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div
					className="container mx-auto max-w-5xl px-4"
					aria-labelledby="infoSectionTitle"
				>
					<h2 className="text-left text-[35px] font-accesible-font mb-4 text-navbar-hover">
						{info.title}
					</h2>
					<div className="font-accesible-font font-extralight text-[20px] text-navbar-hover">
						<TextBlock content={info.content} />
					</div>
				</div>
				<div className="w-full" aria-labelledby="actionSectionTitle">
					<div className="container mx-auto max-w-4xl px-4 text-center text-navbar-hover">
						<h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
							{action.title}
						</h2>
						<div>
							<TextBlock content={action.content} />
						</div>
						<a
							href={"mailto:centro.mistra@aovr.veneto.it"}
							className="inline-block mt-6 bg-navbar text-white font-bold px-6 py-3 rounded-md"
							aria-label="Invia Email a centro.mistra@aovr.veneto.it"
						>
							Invia Email
						</a>
					</div>
				</div>
			</div>
		);
	}, [pageData]);

	if (loading) return <p className="text-center p-4">Loading...</p>;
	if (error)
		return <p className="text-center p-4 text-red-700">Error: {error}</p>;
	if (!pageData) return <p className="text-center p-4">No page data found</p>;

	return (
		<div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8">
			<div aria-live="polite" className="sr-only">
				{loading && "Caricamento..."}
				{error && `Errore: ${error}`}
				{!pageData && !loading && !error && "Nessun dato trovato"}
			</div>

			{loading && <p className="text-center p-4">Caricamento...</p>}
			{error && (
				<p className="text-center p-4 text-red-700" role="alert">
					Errore: {error}
				</p>
			)}
			{!pageData && !loading && !error && (
				<p className="text-center p-4">Nessun dato trovato</p>
			)}
			{renderBlocks}
		</div>
	);
};

export default ContactPage;
