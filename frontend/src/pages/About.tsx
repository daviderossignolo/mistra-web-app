import { useEffect, useMemo, useState } from "react";
import TextBlock from "../components/textBlock";

// Definisco i tipi per i dati della pagina about
type Department = {
	id: number;
	title: string;
	team_member: TeamMember[];
};

type TeamMember = {
	id: number;
	name: string;
	profession: string;
	image: {
		url: string;
	};
};

type AboutPageData = {
	id: number;
	slug: string;
	title: string;
	department: Department[];
	team_section_title: string;
	documentId: string;
	introduction: {
		type: string;
		children: { type: string; text: string }[];
	}[];
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
};

const About: React.FC = () => {
	const [pageData, setPageData] = useState<AboutPageData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPageData = async () => {
			try {
				setLoading(true);
				setError(null);

				// chiamata a strapi per ottenere i dati della pagina about (chi-siamo)
				const response = await fetch(
					"http://localhost:1337/api/about?populate[0]=department.team_member.image",
				);

				// se ho errore nella risposta, lancio un errore
				if (!response.ok) {
					throw new Error("Errore durante il caricamento dei dati");
				}

				// setto i dati ottenuti dalla chiamata nella variabile pageData
				const data = await response.json();
				setPageData(data.data as AboutPageData); // Type assertion here
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (err: any) {
				// se c'è un errore, lo setto nella variabile error
				setError(err.message);
			} finally {
				// ho finito, setto il loading a false
				setLoading(false);
			}
		};
		fetchPageData();
	}, []);

	// funzione utilizzata per renderizzare i blocchi ottenuti dalla chiamata a strapi, usa memo per evitare di ricalcolare il render ad ogni renderizzazione
	const renderBlocks = useMemo(() => {
		if (!pageData) return null;

		const introduction = pageData.introduction;
		const department = pageData.department;
		const teamSectionTitle = pageData.team_section_title;
		const title = pageData.title;

		return (
			<div className="mx-auto w-full max-w-3xl flex flex-col gap-4">
				<div className="w-full bg-navbar-hover px-4 py-4">
					<h2 className="m-0 text-left text-[42px] font-bold font-accesible-font text-white">
						{title}
					</h2>
				</div>

				<div
					className="w-full text-left text-lg font-accesible-font font-extralight text-navbar-hover"
					aria-labelledby="introductionTitle"
				>
					<h2 id="introductionTitle" className="sr-only">
						Introduzione
					</h2>
					<TextBlock content={introduction} />
				</div>

				<div
					className="w-full flex flex-col gap-4"
					aria-labelledby="teamSectionTitle"
				>
					<h2
						id="teamSectionTitle"
						className="bg-navbar-hover px-4 py-4 m-0 text-left text-[42px] font-bold font-accesible-font text-white"
					>
						{teamSectionTitle}
					</h2>
					{department.map((dept: Department) => (
						<div key={dept.id} className="mb-8">
							<h3
								className="mb-4 py-2 text-center text-[24px] font-semibold font-accesible-font text-navbar-hover"
								id={`departmentTitle-${dept.id}`}
							>
								{dept.title}
							</h3>
							<ul
								className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
								aria-labelledby={`departmentTitle-${dept.id}`}
								role="list"
							>
								{dept.team_member.map((member: TeamMember) => (
									<li key={member.id} role="listitem">
										<TeamMemberCard member={member} />
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		);
	}, [pageData]);

	return (
		<div className="min-h-screen flex items-center justify-center p-8">
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

// Componente helper per la creazione delle card dei team member
const TeamMemberCard = ({
	member,
}: {
	member: TeamMember;
}) => (
	<div className="flex flex-col items-center text-center bg-white shadow-md rounded-lg p-4">
		<img
			src={`http://localhost:1337${member.image?.url}`}
			alt={`Foto di ${member.name}`}
			className="w-24 h-24 rounded-full object-cover mb-4"
		/>
		<h4 className="font-bold text-lg text-navbar-hover font-accesible-font">
			{member.name}
		</h4>
		<p className="text-sm text-navbar-hover font-accesible-font">
			{member.profession}
		</p>
	</div>
);

export default About;
