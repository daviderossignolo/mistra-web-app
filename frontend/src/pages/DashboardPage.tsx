import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuizSetupStep from "../components/quizSetupStep";
import QuestionSelectionStep, {
	type QuizData,
} from "../components/QuizSelectionStep";

type Test = {
	id: number;
	documentId: string;
	id_test: string;
	name_test: string;
	description_test: string;
	created_at: string;
	updated_at: string;
	published_at: string;
};

const Sidebar = ({ onSelect }: { onSelect: (section: string) => void }) => {
	return (
		<div className="w-64 bg-white p-6 shadow-md rounded">
			<h2 className="text-xl font-semibold mb-4">Menu</h2>
			<ul>
				<li
					className="cursor-pointer p-2 hover:bg-gray-200 rounded"
					onClick={() => onSelect("executedTests")}
					onKeyUp={(e) => e.key === "Enter" && onSelect("executedTests")}
				>
					Test Eseguiti
				</li>
				<li
					className="cursor-pointer p-2 hover:bg-gray-200 rounded"
					onClick={() => onSelect("testTemplates")}
					onKeyUp={(e) => e.key === "Enter" && onSelect("testTemplates")}
				>
					Gestione Modelli di Test
				</li>
			</ul>
		</div>
	);
};

const DashboardPage = () => {
	const host = process.env.REACT_APP_BACKEND_HOST;
	const port = process.env.REACT_APP_BACKEND_PORT;

	const [executedTests, setExecutedTests] = useState([
		{ id: 1, name: "Test Cognitivo", responses: ["Risposta 1", "Risposta 2"] },
		{ id: 2, name: "Test Fisico", responses: ["Risposta 3", "Risposta 4"] },
	]);

	const [tests, setTests] = useState<Test[]>([]);
	const [selectedTest, setSelectedTest] = useState<QuizData | null>(null); // Tiene traccia del test selezionato
	const [selectedSection, setSelectedSection] = useState<
		"executedTests" | "createTest" | "editTest" | "testTemplates"
	>("executedTests");
	const [newTemplate, setNewTemplate] = useState<QuizData>({
		id: uuidv4(),
		documentId: "",
		name: "",
		description: "",
		questions: [],
	});

	// Effettua il fetch dei test
	useEffect(() => {
		const fetchTest = async () => {
			const response = await fetch(`${host}:${port}/api/tests?pLevel`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				alert(`Errore nel recupero dei test - status: ${response.status}`);
				return;
			}

			const data = await response.json();
			setTests(data.data);
		};

		fetchTest();
	}, [host, port]);

	// Recupero i dati del test selezionato
	const findSelectedTest = async (selectedDocId: string) => {
		const getTestResponse = await fetch(
			`${host}:${port}/api/test-plugin/get-complete-test`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ testDocId: selectedDocId }),
			},
		);

		if (!getTestResponse.ok) {
			alert(`Errore nel recupero dei test - status: ${getTestResponse.status}`);
			return;
		}

		const data = await getTestResponse.json();

		return data;
	};

	// Funzione per gestire l'eliminazione di un test
	const handleDelete = async (selectedDocId: string) => {
		const toDelete = await findSelectedTest(selectedDocId);

		// Elimino il test
		const response = await fetch(
			`${host}:${port}/api/test-plugin/delete-test`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ quiz: toDelete }),
			},
		);

		if (!response.ok) {
			alert(
				`Errore durante l'eliminazione del test - status: ${response.status}`,
			);
			return;
		}
		setSelectedTest(null);
		window.location.reload();
	};

	return (
		<div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-100 min-h-75">
			<Sidebar
				onSelect={(section) =>
					setSelectedSection(
						section as
							| "executedTests"
							| "createTest"
							| "editTest"
							| "testTemplates",
					)
				}
			/>

			{/* Sezione "Test Eseguiti" */}
			{selectedSection === "executedTests" && (
				<div className="flex-1 bg-white p-6 shadow-md rounded">
					<h2 className="text-xl font-semibold mb-4">Test Eseguiti</h2>
					<ul>
						{executedTests.map((test) => (
							<li
								key={test.id}
								className="cursor-pointer p-2 hover:bg-gray-200 rounded"
							>
								{test.name}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Sezione "Modelli di Test" */}
			{selectedSection === "testTemplates" && (
				<div className="flex-1 bg-white p-6 shadow-md rounded">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
							Gestione test
						</h2>
					</div>
					<div className="flex gap-2 mb-4 mt-4">
						<input
							type="text"
							placeholder="Cerca test..."
							className="flex-1 px-4 py-2 border rounded"
						/>
						<button
							type="button"
							className="bg-blue-500 text-white px-4 py-2 rounded"
							onClick={() => setSelectedSection("createTest")}
						>
							Crea Nuovo Modello di Test
						</button>
					</div>
					<div className="container py-8">
						<h2 className="font-bold font-poppins text-2xl text-navbar-hover mb-4">
							Informazioni sul test
						</h2>
						<hr className="mb-4" />
						<ul>
							{tests.map((test) => (
								<li
									key={test.id}
									className="flex justify-between items-center p-2 rounded cursor-pointer"
								>
									<span>{test.name_test}</span>
									<div className="flex gap-2">
										<button
											type="button"
											className="bg-yellow-500 text-white px-2 py-1 rounded"
											onClick={async () => {
												const data = await findSelectedTest(test.documentId);
												setSelectedTest(data);
												setSelectedSection("editTest");
											}}
											onKeyDown={async (e) => {
												if (e.key === "Enter") {
													const data = await findSelectedTest(test.documentId);
													setSelectedTest(data);
													setSelectedSection("editTest");
												}
											}}
										>
											Modifica
										</button>
										<button
											type="button"
											className="bg-red-500 text-white px-2 py-1 rounded"
											onClick={async () => {
												handleDelete(test.documentId);
											}}
											onKeyDown={async (e) => {
												if (e.key === "Enter") {
													handleDelete(test.documentId);
												}
											}}
										>
											Elimina
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			{/* Sezione per la creazione o modifica del test */}
			{selectedSection === "createTest" && (
				<div className="flex-1 bg-white p-6 shadow-md rounded">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
							CREAZIONE QUIZ
						</h2>
					</div>
					<QuestionSelectionStep quizData={newTemplate} edit={false} />
				</div>
			)}

			{/* Sezione per la creazione o modifica del test */}
			{selectedSection === "editTest" && (
				<div className="flex-1 bg-white p-6 shadow-md rounded">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
							MODIFICA QUIZ
						</h2>
					</div>
					<QuestionSelectionStep
						quizData={selectedTest ?? newTemplate}
						edit={true}
					/>
				</div>
			)}
		</div>
	);
};

export default DashboardPage;
