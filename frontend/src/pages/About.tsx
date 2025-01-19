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
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	image: any;
};

type AboutPageData = {
	id: number;
	slug: string;
	title: string;
	department: Department[];
	team_section_title: string;
	documentId: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	introduction: any;
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
				console.log(data);
				setPageData(data.data);
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
			<div>
				<div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
							{title}
						</h2>
					</div>
					<div className="w-full text-left text-lg font-poppins font-extralight text-navbar-hover">
						<TextBlock content={introduction} />
					</div>
				</div>
				<div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
							{teamSectionTitle}
						</h2>
					</div>
					{department.map((dept: Department) => (
						<div key={dept.id} className="mb-8">
							<h3 className="text-lg font-semibold font-poppins mb-4 py-2 text-center text-navbar-hover text-[24px]">
								{dept.title}
							</h3>
							{/* Render dei team member, tramite componente helper per la creazione delle card */}
							<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
								{dept.team_member.map((member: TeamMember) => (
									<TeamMemberCard
										key={member.id}
										name={member.name}
										profession={member.profession}
										image={member.image}
									/>
								))}
							</div>
						</div>
					))}
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

// Componente helper per la creazione delle card dei team member
const TeamMemberCard = ({
	name,
	profession,
	image,
}: {
	name: string;
	profession: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	image: any;
}) => (
	<div className="flex flex-col items-center text-center bg-white shadow-md rounded-lg p-4">
		<img
			src={`http://localhost:1337${image?.url}`}
			alt={image?.alternativeText}
			className="w-24 h-24 rounded-full object-cover mb-4"
		/>
		<h4 className="font-bold text-lg text-navbar-hover font-poppins">{name}</h4>
		<p className="text-sm text-navbar-hover font-poppins">{profession}</p>
	</div>
);

export default About;
