import type React from "react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuestionSelectionStep, {
	type QuizData,
} from "../components/QuizSelectionStep";
import { formatTime } from "../utils";

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

type ExecutedTest = {
	id: number;
	documentId: string;
	age: number;
	score: number;
	execution_time: string;
	revision_date: string;
	note: string;
	test_execution_id: string;
	ip: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	id_sex: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	id_test: any;
};

type ExecutedTestFull = {
	test_info: {
		documentId: string;
		test_name: string;
		test_description: string;
		score: number;
		execution_time: string;
		revision_date: string;
		note: string;
		user_info: {
			age: number;
			sex: string;
			ip: string;
		};
	};
	questions: {
		category_name: string;
		question_name: string;
		question_text: string;
		answers: {
			documentId: string;
			answer_text: string;
			answer_correction: string;
			user_selected: boolean;
		}[];
	}[];
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

const DashboardPage: React.FC = () => {
	// Variabili d'ambiente
	const host = process.env.REACT_APP_BACKEND_HOST;
	const port = process.env.REACT_APP_BACKEND_PORT;

	const [executedTests, setExecutedTests] = useState<ExecutedTest[]>([]);
	const [tests, setTests] = useState<Test[]>([]);
	const [selectedTest, setSelectedTest] = useState<QuizData | null>(null);
	const [selectedSection, setSelectedSection] = useState<
		"executedTests" | "createTest" | "editTest" | "testTemplates" | "viewTest"
	>("testTemplates");
	const [newTemplate, setNewTemplate] = useState<QuizData>({
		id: uuidv4(),
		documentId: "",
		name: "",
		description: "",
		questions: [],
	});
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedExecution, setSelectedExecution] =
		useState<ExecutedTestFull | null>(null);

	const [notes, setNotes] = useState("");
	const service_key = process.env.SERVICE_KEY;

	// Effettua il fetch dei test
	useEffect(() => {
		const token = localStorage.getItem("token");

		const fetchTest = async () => {
			const response = await fetch(`${host}:${port}/api/tests?pLevel`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				alert(`Errore nel recupero dei test - status: ${response.status}`);
				return;
			}

			const data = await response.json();
			setTests(data.data);
		};

		const fetchExecutedTests = async () => {
			const response = await fetch(
				`${host}:${port}/api/test-executions?pLevel`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Api key ${token}`,
					},
				},
			);

			console.log(response);

			if (!response.ok) {
				alert(
					`Errore nel recupero dei test eseguiti - status: ${response.status}`,
				);
				return;
			}

			const data = await response.json();
			setExecutedTests(data.data);
		};

		fetchTest();
		fetchExecutedTests();
	}, [host, port]);

	// Recupero i dati del test selezionato
	const findSelectedTest = async (selectedDocId: string) => {
		const token = localStorage.getItem("token");

		const getTestResponse = await fetch(
			`${host}:${port}/api/test-plugin/get-complete-test`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
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

	// Funzione per gestire la ricerca dei test
	const handleSearch = async () => {
		const token = localStorage.getItem("token");

		// Se il termine è vuoto allora recupero tutti i test
		if (searchTerm === "") {
			const fetchTest = async () => {
				const response = await fetch(`${host}:${port}/api/tests?pLevel`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
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
			return;
		}

		// Altrimenti filtro i test in base al termine di ricerca
		setTests(tests.filter((test) => test.name_test.includes(searchTerm)));
		setSearchTerm("");
	};

	const handleSearchExecutions = async () => {
		// Se il termine è vuoto allora recupero tutti i test
		if (searchTerm === "") {
			const fetchTest = async () => {
				const response = await fetch(
					`${host}:${port}/api/test-executions?pLevel`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
					},
				);

				if (!response.ok) {
					alert(`Errore nel recupero dei test - status: ${response.status}`);
					return;
				}

				const data = await response.json();
				setExecutedTests(data.data);
			};

			fetchTest();
			return;
		}

		// Altrimenti filtro i test in base al termine di ricerca
		setExecutedTests(
			executedTests.filter((test) =>
				test.test_execution_id.includes(searchTerm),
			),
		);
		setSearchTerm("");
	};

	// Funzione per gestire l'eliminazione di un test
	const handleDelete = async (selectedDocId: string) => {
		const token = localStorage.getItem("token");

		const toDelete = await findSelectedTest(selectedDocId);

		// Elimino il test
		const response = await fetch(
			`${host}:${port}/api/test-plugin/delete-test`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
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

	const findSelectedExecutionTest = async (documentId: string) => {
		const token = process.env.SERVICE_KEY;

		const getTestResponse = await fetch(
			`${host}:${port}/api/test-plugin/get-test-execution`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Api key ${token}`,
				},
				body: JSON.stringify({ execDocId: documentId }),
			},
		);

		if (!getTestResponse.ok) {
			alert(`Errore nel recupero dei test - status: ${getTestResponse.status}`);
			return;
		}

		const data = await getTestResponse.json();
		console.log(data);
		setNotes(data.test_info.note);

		return data;
	};

	const handleInsertNote = async (documentId: string) => {
		console.log(documentId);
		console.log(notes);

		const revisionResponse = await fetch(
			`${host}:${port}/api/test-executions/${documentId}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					data: {
						note: notes,
						revision_date: new Date().toISOString().split("T")[0],
					},
				}),
			},
		);

		if (!revisionResponse.ok) {
			alert("Non è stato possibile inserire le note");
		}

		if (revisionResponse.ok) {
			alert("Note inserite correttamente");
		}
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
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[2.625rem]">
							Test Eseguiti
						</h2>
					</div>
					<div className="flex-1 flex items-center border rounded mt-3">
						<input
							type="text"
							placeholder="Cerca test..."
							className="flex-1 px-4 py-2 border-none rounded-l"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button
							type="button"
							className="bg-navbar text-white px-4 py-2 rounded-r"
							onClick={() => handleSearchExecutions()}
						>
							Cerca
						</button>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full bg-white border text-sm mt-4">
							<thead>
								<tr>
									{[
										"ID",
										"Punteggio",
										"Sesso",
										"Nome test",
										"Revisionato",
										"Azioni",
									].map((header) => (
										<th key={header} className="py-2 border w-1/10 text-center">
											{header}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{executedTests.map((test) => (
									<tr key={test.id} className="hover:bg-gray-200">
										<td className="py-2 text-center">
											{test.test_execution_id}
										</td>
										<td className="py-2 text-center">{test.score}</td>
										<td className="py-2 text-center">{test.id_sex.name}</td>
										<td className="py-2 text-center">
											{test.id_test.name_test}
										</td>
										<td className="py-2 text-center">
											<input
												type="checkbox"
												checked={test.revision_date !== null}
											/>
										</td>
										<td className="py-2 text-center">
											<button
												type="button"
												className="bg-navbar-hover text-white py-1 px-2 rounded"
												onClick={async () => {
													const data = await findSelectedExecutionTest(
														test.documentId,
													);
													setSelectedExecution(data);
													setSelectedSection("viewTest");
												}}
											>
												<div className="flex items-center space-x-1">
													<span>Visualizza</span>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width="16"
														height="16"
														fill="currentColor"
														className="bi bi-eye"
														viewBox="0 0 16 16"
													>
														<title>Visualizza</title>
														<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
														<path d="M8 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
													</svg>
												</div>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Sezione "Gestione Modelli di Test" */}
			{selectedSection === "testTemplates" && (
				<div className="flex-1 bg-white p-6 shadow-md rounded">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
							Gestione test
						</h2>
					</div>
					<div className="flex gap-2 mb-4 mt-4">
						<div className="flex-1 flex items-center border rounded">
							<input
								type="text"
								placeholder="Cerca test..."
								className="flex-1 px-4 py-2 border-none rounded-l"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<button
								type="button"
								className="bg-navbar text-white px-4 py-2 rounded-r"
								onClick={() => handleSearch()}
							>
								Cerca
							</button>
						</div>
						<button
							type="button"
							className="bg-navbar text-white px-4 py-2 rounded"
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
									<div className="flex space-x-2">
										<button
											type="button"
											className="bg-navbar-hover text-white py-1 px-2 rounded"
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
											<div className="flex items-center space-x-1">
												<span>Modifica</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													fill="currentColor"
													className="bi bi-pencil-square"
													viewBox="0 0 16 16"
												>
													<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
													<path
														fill-rule="evenodd"
														d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
													/>
													<title>Modifica</title>
												</svg>
											</div>
										</button>
										<button
											type="button"
											className="text-white bg-red-600 py-1 px-2 rounded"
											onClick={async () => {
												handleDelete(test.documentId);
											}}
											onKeyDown={async (e) => {
												if (e.key === "Enter") {
													handleDelete(test.documentId);
												}
											}}
										>
											<div className="flex items-center space-x-1">
												<span>Elimina</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													fill="currentColor"
													className="bi bi-trash-fill"
													viewBox="0 0 16 16"
												>
													<title>Elimina</title>
													<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
												</svg>
											</div>
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

			{/* Sezione per la visualizzazione del test */}
			{selectedSection === "viewTest" && (
				<div className="flex-1 font-poppins text-navbar-hover">
					<div className="flex flex-col w-full bg-white p-6 shadow-md rounded">
						{/* Informazioni sul test da eseguire */}
						{selectedExecution && (
							<>
								<div className="w-full bg-navbar-hover px-4 py-4">
									<h2 className="text-white font-bold font-poppins m-0 text-left text-[2.625rem]">
										Risultati del Test
									</h2>
								</div>
								{/* Sezione informazioni */}
								<div className="mt-2 py-4 mb-6 p-4">
									<h2 className="text-2xl font-bold mb-2 text-navbar-hover">
										Informazioni sul test
									</h2>
									<hr className="mb-4" />
									<div className="mb-4">
										{/* Nome del test e data di esecuaione */}
										<div className="flex items-center mb-2 justify-between">
											<div className="flex items-center mb-2">
												<h3 className="text-lg font-semibold mr-2 text-navbar-hover">
													Nome del Test:
												</h3>
												<h3 className="text-lg text-navbar-hover">
													{selectedExecution.test_info.test_name}
												</h3>
											</div>
											<div className="flex items-center mb-2">
												<h3 className="text-lg font-semibold mr-2 text-navbar-hover">
													Eseguito il:
												</h3>
												<h3 className="text-lg text-navbar-hover">
													{formatTime(
														selectedExecution.test_info.execution_time,
													)}
												</h3>
											</div>
										</div>

										{/* Descrizione del test */}
										<div className="flex flex-col items-left mb-2">
											<h3 className="text-lg font-semibold mr-2 text-navbar-hover">
												Descrizione:
											</h3>
											<textarea
												className="w-full p-2 border rounded-lg"
												value={selectedExecution.test_info.test_description}
												readOnly
											/>
										</div>

										{/* Note e data visualizzazione */}
										<div className="flex flex-col mb-4">
											<h3 className="text-lg font-semibold text-navbar-hover mb-2">
												Note:
											</h3>
											<textarea
												className="w-full p-2 border rounded-lg mb-4"
												value={notes}
												onChange={(e) => setNotes(e.target.value)}
											/>
											<h3 className="text-lg font-semibold text-navbar-hover mb-2">
												Visionato il:
											</h3>
											<p className="text-lg text-navbar-hover">
												{formatTime(selectedExecution.test_info.revision_date)}
											</p>
										</div>
										<div className="flex">
											<button
												type="button"
												className="bg-navbar-hover text-white py-2 px-4 rounded"
												onClick={() =>
													handleInsertNote(
														selectedExecution.test_info.documentId,
													)
												}
											>
												Inserisci nota
											</button>
										</div>

										{/* Punteggio del test */}
										<div className="flex justify-end mb-2">
											<h3 className="text-lg font-semibold mr-2 text-navbar-hover">
												Punteggio:
											</h3>
											<h3 className="text-lg text-navbar-hover">
												{selectedExecution.test_info.score}
											</h3>
										</div>
									</div>
									<h2 className="text-2xl font-bold mb-2 text-navbar-hover">
										Informazioni sull'utente
									</h2>
									<hr className="mb-4" />
									<div className="mb-4">
										<div className="flex items-center mb-2">
											<h3 className="text-lg font-semibold mr-2 text-navbar-hover">
												Età:
											</h3>
											<h3 className="text-lg text-navbar-hover">
												{selectedExecution.test_info.user_info.age}
											</h3>
										</div>
										<div className="flex items-center mb-2">
											<h3 className="text-lg font-semibold mr-2 text-navbar-hover">
												Sesso:
											</h3>
											<h3 className="text-lg text-navbar-hover">
												{selectedExecution.test_info.user_info.sex}
											</h3>
										</div>
										<div className="flex items-center mb-2">
											<h3 className="text-lg font-semibold mr-2 text-navbar-hover">
												IP:
											</h3>
											<h3 className="text-lg text-navbar-hover">
												{selectedExecution.test_info.user_info.ip}
											</h3>
										</div>
									</div>
								</div>
							</>
						)}

						{/* Sezione domande del test */}
						{selectedExecution?.questions.map((question, index) => {
							return (
								<div
									key={question.question_name}
									className="py-4 p-4 shadow-sm"
								>
									<h2 className="text-2xl font-bold mb-2 text-navbar-hover">
										Domande
									</h2>
									<hr className="mb-4" />
									<div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50 font-poppins">
										<p className="text-sm text-gray-600 mb-2">
											Categoria: {question.category_name}
										</p>
										<h2 className="text-lg font-medium mb-2">
											{index + 1}. {question.question_name}:{" "}
											{question.question_text}
										</h2>
										<div className="flex flex-col space-y-2">
											{question.answers.map((answer) => (
												<label
													key={answer.documentId}
													className="flex items-center space-x-2"
												>
													<input
														type="radio"
														name={`question-${question.question_name}`}
														value={answer.documentId}
														checked={answer.user_selected}
														disabled
														className="form-radio text-navbar"
													/>
													<span className="text-navbar-hover">
														{answer.answer_text}
													</span>
												</label>
											))}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default DashboardPage;
