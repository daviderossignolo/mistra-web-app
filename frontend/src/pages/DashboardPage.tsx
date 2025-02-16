import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuestionSelectionStep, {
	type QuizData,
} from "../components/QuizSelectionStep";
import { formatTime } from "../utils";
import type { Category } from "../components/QuestionModal";
import QuestionModal from "../components/QuestionModal";
import CategoryModal from "../components/CategoryModal";

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
	id_sex: {
		id: number;
		name: string;
	};
	id_test: {
		id: number;
		name_test: string;
	};
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

type Question = {
	category: Category;
	documentId: string;
	id: string;
	name: string;
	text: string;
};

type FullQuestion = {
	id: string;
	documentId: string;
	name: string;
	text: string;
	category: Category;
	answers: {
		id: string;
		documentId: string;
		text: string;
		score: number;
		correction: string;
	}[];
};

// Definisco un tipo per le voci del menu della sidebar
type SidebarItemProps = {
	id: string;
	label: string;
	onClick: () => void;
};

// Componente per le voci del menu della sidebar
const SidebarItem: React.FC<SidebarItemProps> = ({ id, label, onClick }) => {
	return (
		<li className="cursor-pointer p-2 hover:bg-gray-200 rounded">
			<button
				id={id}
				className="w-full text-left"
				onClick={onClick}
				type="button"
			>
				{label}
			</button>
		</li>
	);
};

const Sidebar = ({ onSelect }: { onSelect: (section: string) => void }) => {
	return (
		<nav
			className="w-64 bg-white p-6 shadow-md rounded"
			aria-label="Menu principale"
		>
			<h2 className="text-xl font-semibold mb-4">Menu</h2>
			<ul className="list-none pl-0">
				<SidebarItem
					id="executedTestsButton"
					label="Test Eseguiti"
					onClick={() => onSelect("executedTests")}
				/>
				<SidebarItem
					id="testTemplatesButton"
					label="Gestione Modelli di Test"
					onClick={() => onSelect("testTemplates")}
				/>
				<SidebarItem
					id="manageQuestionButton"
					label="Gestione Delle Domande"
					onClick={() => onSelect("manageQuestion")}
				/>
				<SidebarItem
					id="manageCategoriesButton"
					label="Gestione Delle Categorie"
					onClick={() => onSelect("manageCategories")}
				/>
			</ul>
		</nav>
	);
};

const DashboardPage: React.FC = () => {
	const findSelectedCategory = async (documentId: string) => {
		// Replace this with your actual logic to fetch or filter the category using documentId
		return categories.find((category) => category.documentId === documentId);
	};
	// Variabili d'ambiente
	const host = process.env.REACT_APP_BACKEND_HOST;
	const port = process.env.REACT_APP_BACKEND_PORT;

	const [executedTests, setExecutedTests] = useState<ExecutedTest[]>([]);
	const [tests, setTests] = useState<Test[]>([]);
	const [selectedTest, setSelectedTest] = useState<QuizData | null>(null);
	const [selectedSection, setSelectedSection] = useState<
		| "executedTests"
		| "createTest"
		| "editTest"
		| "testTemplates"
		| "viewTest"
		| "manageQuestion"
		| "manageCategories"
	>(() => {
		const storedSection = localStorage.getItem("selectedSection") as
			| "executedTests"
			| "createTest"
			| "editTest"
			| "testTemplates"
			| "viewTest"
			| "manageQuestion"
			| "manageCategories"
			| null;
		return storedSection ?? "testTemplates";
	});
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
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [notes, setNotes] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<
		Category | undefined
	>(undefined);
	const [questions, setQuestions] = useState<Question[]>([]);
	const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState<
		FullQuestion | undefined
	>(undefined);
	const [newQuestion, setNewQuestion] = useState<FullQuestion>({
		id: "",
		documentId: "",
		name: "",
		text: "",
		category: {
			id_category: "",
			name: "",
			documentId: "",
		},
		answers: [
			{
				id: "",
				documentId: "",
				text: "",
				score: 0,
				correction: "",
			},
		],
	});
	const [isNew, setIsNew] = useState(false);
	const [newCategory, setNewCategory] = useState<Category>({
		id_category: "",
		name: "",
		documentId: "",
	});

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
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!response.ok) {
				alert(
					`Errore nel recupero dei test eseguiti - status: ${response.status}`,
				);
				return;
			}

			const data = await response.json();

			// filtro via i test eseguiti a cui non è associato un test perchè è stato eliminato
			data.data = data.data.filter(
				(test: { id_test: null }) => test.id_test !== null,
			);

			setExecutedTests(data.data);
		};

		const fetchCategories = async () => {
			const response = await fetch(`${host}:${port}/api/categories?pLevel`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				alert(
					`Errore nel recupero delle categorie - status: ${response.status}`,
				);
				return;
			}

			const data = await response.json();
			setCategories(data.data);
		};

		const fetchQuestions = async () => {
			const response = await fetch(
				`${host}:${port}/api/test-plugin/get-questions`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!response.ok) {
				alert(`Errore nel recupero delle domande - status: ${response.status}`);
				return;
			}

			const data = await response.json();
			console.log(data);
			setQuestions(data);
		};

		fetchTest();
		fetchQuestions();
		fetchCategories();
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
		const token = localStorage.getItem("token");

		// Se il termine è vuoto allora recupero tutti i test
		if (searchTerm === "") {
			const fetchTest = async () => {
				const response = await fetch(
					`${host}:${port}/api/test-executions?pLevel`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);

				if (!response.ok) {
					alert(`Errore nel recupero dei test - status: ${response.status}`);
					return;
				}

				const data = await response.json();

				// filtro via i test eseguiti a cui non è associato un test perchè è stato eliminato
				data.data = data.data.filter(
					(test: { id_test: null }) => test.id_test !== null,
				);

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
		localStorage.setItem("selectedSection", "testTemplates");
		window.location.reload();
	};

	const findSelectedExecutionTest = async (documentId: string) => {
		const token = localStorage.getItem("token");
		const getTestResponse = await fetch(
			`${host}:${port}/api/test-plugin/get-test-execution`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ execDocId: documentId }),
			},
		);

		if (!getTestResponse.ok) {
			alert(`Errore nel recupero dei test - status: ${getTestResponse.status}`);
			return;
		}

		const data = await getTestResponse.json();

		setNotes(data.test_info.note);

		return data;
	};

	const handleInsertNote = async (documentId: string) => {
		const token = localStorage.getItem("token");
		const revisionDate = new Date();
		revisionDate.setHours(revisionDate.getHours() + 1);
		const revisionResponse = await fetch(
			`${host}:${port}/api/test-executions/${documentId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					data: {
						note: notes,
						revision_date: revisionDate.toISOString().split("T")[0],
					},
				}),
			},
		);

		if (!revisionResponse.ok) {
			alert("Non è stato possibile inserire le note");
		}

		if (revisionResponse.ok) {
			alert("Note inserite correttamente");
			localStorage.setItem("selectedSection", "executedTests");
			window.location.reload();
		}
	};

	const deleteQuestionModel = async (documentId: string) => {
		const token = localStorage.getItem("token");
		const response = await fetch(
			`${host}:${port}/api/test-plugin/delete-question-model`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ 
					question_id: documentId, 
					//medicJWT: token 
				}),
			},
		);

		if (!response.ok) {
			alert("Errore durante l'eliminazione della domanda");
			return;
		}

		setQuestions(
			questions.filter((question) => question.documentId !== documentId),
		);
	};

	// Funzione per gestire la ricerca dei test
	const handleQuestionSearch = async () => {
		const token = localStorage.getItem("token");

		// Se il termine è vuoto allora recupero tutti i test
		if (searchTerm === "") {
			const fetchQuestion = async () => {
				const response = await fetch(
					`${host}:${port}/api/test-plugin/get-questions`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);

				if (!response.ok) {
					alert(
						`Errore nel recupero delle domande - status: ${response.status}`,
					);
					return;
				}

				const data = await response.json();
				setQuestions(data);
			};

			fetchQuestion();
			return;
		}

		// Altrimenti filtro i test in base al termine di ricerca
		setQuestions(
			questions.filter((question) => question.name.includes(searchTerm)),
		);
		setSearchTerm("");
	};

	const findSelectedQuestion = async (selectedDocId: string) => {
		const token = localStorage.getItem("token");

		const getQuestionResponse = await fetch(
			`${host}:${port}/api/test-plugin/get-complete-question`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ question_id: selectedDocId }),
			},
		);

		if (!getQuestionResponse.ok) {
			alert(
				`Errore nel recupero della domanda - status: ${getQuestionResponse.status}`,
			);
			return;
		}

		const data = await getQuestionResponse.json();
		console.log(data);
		console.log(data.answers);

		return data;
	};

	const handleDeleteCategory = async (documentId: string) => {
		const token = localStorage.getItem("token");
		const response = await fetch(
			`${host}:${port}/api/test-plugin/delete-category`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ documentId: documentId }),
			},
		);

		if (!response.ok) {
			alert("Errore durante l'eliminazione della categoria");
			return;
		}

		setCategories(
			categories.filter((category) => category.documentId !== documentId),
		);
	};

	return (
		<div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-100 min-h-75">
			<Sidebar
				onSelect={(section) =>
					setSelectedSection(
						section as "executedTests" | "testTemplates" | "manageQuestion",
					)
				}
			/>

			{/* Sezione "Test Eseguiti" */}
			{selectedSection === "executedTests" && (
				<section
					className="flex-1 bg-white p-6 shadow-md rounded"
					aria-labelledby="executedTestsHeading"
				>
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2
							id="executedTestsHeading"
							className="text-white font-bold font-accesible-font m-0 text-left text-[2.625rem]"
						>
							Test Eseguiti
						</h2>
					</div>
					<form
						className="flex-1 flex items-center border rounded mt-3"
						onSubmit={(e) => {
							e.preventDefault();
							handleSearchExecutions();
						}}
					>
						<label htmlFor="searchExecutedTests" className="sr-only">
							Cerca test eseguiti
						</label>
						<input
							type="text"
							id="searchExecutedTests"
							placeholder="Cerca test..."
							className="flex-1 px-4 py-2 border-none rounded-l"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<button
							type="submit"
							className="bg-navbar text-white px-4 py-2 rounded-r"
						>
							Cerca
						</button>
					</form>
					{/* Modifica 3: Tabella accessibile */}
					<div className="overflow-x-auto">
						<table
							className="min-w-full bg-white border text-sm mt-4"
							aria-label="Tabella dei test eseguiti"
						>
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
										<th
											key={header}
											className="py-2 border w-1/10 text-center"
											scope="col"
										>
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
											{test.id_test?.name_test}
										</td>
										<td className="py-2 text-center">
											<input
												type="checkbox"
												checked={test.revision_date !== null}
												readOnly
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
														aria-hidden="true" // Nascondi l'icona agli screen reader
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
				</section>
			)}

			{/* Sezione "Gestione Modelli di Test" */}
			{selectedSection === "testTemplates" && (
				<section
					className="flex-1 bg-white p-6 shadow-md rounded"
					aria-labelledby="manageTestsHeading"
				>
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2
							id="manageTestsHeading"
							className="text-white font-bold font-accesible-font m-0 text-left text-[42px]"
						>
							Gestione test
						</h2>
					</div>
					<div className="flex gap-2 mb-4 mt-4">
						<form
							className="flex-1 flex items-center border rounded"
							onSubmit={(e) => {
								e.preventDefault();
								handleSearch();
							}}
						>
							<label htmlFor="searchTests" className="sr-only">
								Cerca test
							</label>
							<input
								type="text"
								id="searchTests"
								placeholder="Cerca test..."
								className="flex-1 px-4 py-2 border-none rounded-l"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<button
								type="submit"
								className="bg-navbar text-white px-4 py-2 rounded-r"
							>
								Cerca
							</button>
						</form>
						<button
							type="button"
							className="bg-navbar text-white px-4 py-2 rounded"
							onClick={() => setSelectedSection("createTest")}
						>
							Crea Nuovo Modello di Test
						</button>
					</div>
					<div className="container py-8">
						<h3 className="font-bold font-accesible-font text-2xl text-navbar-hover mb-4">
							Informazioni sul test
						</h3>
						<hr className="mb-4" />
						<ul className="list-none pl-0">
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
													aria-hidden="true" // Nascondi l'icona agli screen reader
												>
													<title>Modifica</title>
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
													aria-hidden="true" // Nascondi l'icona agli screen reader
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
				</section>
			)}

			{/* Sezione per la creazione o modifica del test */}
			{selectedSection === "createTest" && (
				<section
					className="flex-1 bg-white p-6 shadow-md rounded"
					aria-labelledby="createQuizHeading"
				>
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2
							id="createQuizHeading"
							className="text-white font-bold font-accesible-font m-0 text-left text-[42px]"
						>
							CREAZIONE QUIZ
						</h2>
					</div>
					<QuestionSelectionStep
						quizData={newTemplate}
						edit={false}
						readOnly={false}
					/>
				</section>
			)}

			{/* Sezione per la modifica del test */}
			{selectedSection === "editTest" && (
				<section
					className="flex-1 bg-white p-6 shadow-md rounded"
					aria-labelledby="editQuizHeading"
				>
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2
							id="editQuizHeading"
							className="text-white font-bold font-accesible-font m-0 text-left text-[42px]"
						>
							MODIFICA QUIZ
						</h2>
					</div>
					<QuestionSelectionStep
						quizData={selectedTest ?? newTemplate}
						edit={true}
						readOnly={true}
					/>
				</section>
			)}

			{/* Sezione per la visualizzazione del test */}
			{selectedSection === "viewTest" && (
				<section
					className="flex-1 font-accesible-font text-navbar-hover"
					aria-labelledby="testResultsHeading"
				>
					<div className="flex flex-col w-full bg-white p-6 shadow-md rounded">
						{/* Informazioni sul test da eseguire */}
						{selectedExecution && (
							<>
								<div className="w-full bg-navbar-hover px-4 py-4">
									<h2
										id="testResultsHeading"
										className="text-white font-bold font-accesible-font m-0 text-left text-[2.625rem]"
									>
										Risultati del Test
									</h2>
								</div>
								{/* Sezione informazioni */}
								<div className="mt-2 py-4 mb-6 p-4">
									<h3 className="text-2xl font-bold mb-2 text-navbar-hover">
										Informazioni sul test
									</h3>
									<hr className="mb-4" />
									<div className="mb-4">
										{/* Nome del test e data di esecuzione */}
										<div className="flex items-center mb-2 justify-between">
											<div className="flex items-center mb-2">
												<h4 className="text-lg font-semibold mr-2 text-navbar-hover">
													Nome del Test:
												</h4>
												<p className="text-lg text-navbar-hover">
													{selectedExecution.test_info.test_name}
												</p>
											</div>
											<div className="flex items-center mb-2">
												<h4 className="text-lg font-semibold mr-2 text-navbar-hover">
													Eseguito il:
												</h4>
												<p className="text-lg text-navbar-hover">
													{formatTime(
														selectedExecution.test_info.execution_time,
													)}
												</p>
											</div>
										</div>

										{/* Descrizione del test */}
										<div className="flex flex-col items-left mb-2">
											<h4 className="text-lg font-semibold mr-2 text-navbar-hover">
												Descrizione:
											</h4>
											<textarea
												className="w-full p-2 border rounded-lg"
												value={selectedExecution.test_info.test_description}
												readOnly
											/>
										</div>

										{/* Note e data visualizzazione */}
										<div className="flex flex-col mb-4">
											<label
												htmlFor="notes"
												className="text-lg font-semibold text-navbar-hover mb-2"
											>
												Note:
											</label>
											<textarea
												id="notes"
												className="w-full p-2 border rounded-lg mb-4"
												value={notes}
												onChange={(e) => setNotes(e.target.value)}
											/>
											<h4 className="text-lg font-semibold text-navbar-hover mb-2">
												Visionato il:
											</h4>
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
												aria-label="Inserisci nota"
											>
												Inserisci nota
											</button>
										</div>

										{/* Punteggio del test */}
										<div className="flex justify-end mb-2">
											<h4 className="text-lg font-semibold mr-2 text-navbar-hover">
												Punteggio:
											</h4>
											<p className="text-lg text-navbar-hover">
												{selectedExecution.test_info.score}
											</p>
										</div>
									</div>
									<h3 className="text-2xl font-bold mb-2 text-navbar-hover">
										Informazioni sull'utente
									</h3>
									<hr className="mb-4" />
									<div className="mb-4">
										<div className="flex items-center mb-2">
											<h4 className="text-lg font-semibold mr-2 text-navbar-hover">
												Età:
											</h4>
											<p className="text-lg text-navbar-hover">
												{selectedExecution.test_info.user_info.age}
											</p>
										</div>
										<div className="flex items-center mb-2">
											<h4 className="text-lg font-semibold mr-2 text-navbar-hover">
												Sesso:
											</h4>
											<p className="text-lg text-navbar-hover">
												{selectedExecution.test_info.user_info.sex}
											</p>
										</div>
										<div className="flex items-center mb-2">
											<h4 className="text-lg font-semibold mr-2 text-navbar-hover">
												IP:
											</h4>
											<p className="text-lg text-navbar-hover">
												{selectedExecution.test_info.user_info.ip}
											</p>
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
									<h3 className="text-2xl font-bold mb-2 text-navbar-hover">
										Domande
									</h3>
									<hr className="mb-4" />
									<div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50 font-accesible-font">
										<p className="text-sm text-gray-600 mb-2">
											Categoria: {question.category_name}
										</p>
										<h4 className="text-lg font-medium mb-2">
											{index + 1}. {question.question_name}:{" "}
											{question.question_text}
										</h4>
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
				</section>
			)}

			{/* Sezione per la gestione delle domande */}
			{selectedSection === "manageQuestion" && (
				<section
					className="flex-1 bg-white p-6 shadow-md rounded"
					aria-labelledby="manageTestsHeading"
				>
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2
							id="manageTestsHeading"
							className="text-white font-bold font-accesible-font m-0 text-left text-[42px]"
						>
							Gestione delle Domande
						</h2>
					</div>
					<div className="flex gap-2 mb-4 mt-4">
						<form
							className="flex-1 flex items-center border rounded"
							onSubmit={(e) => {
								e.preventDefault();
								handleQuestionSearch();
							}}
						>
							<label htmlFor="searchQuestion" className="sr-only">
								Cerca Domanda
							</label>
							<input
								type="text"
								id="searchQuestion"
								placeholder="Cerca domanda..."
								className="flex-1 px-4 py-2 border-none rounded-l"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<button
								type="submit"
								className="bg-navbar text-white px-4 py-2 rounded-r"
							>
								Cerca
							</button>
						</form>
						<button
							type="button"
							className="bg-navbar text-white px-4 py-2 rounded"
							onClick={() => {
								setIsNew(true);
								setIsQuestionModalOpen(true);
							}}
						>
							Crea Nuova Domanda
						</button>
					</div>
					<div className="container py-8">
						<h3 className="font-bold font-accesible-font text-2xl text-navbar-hover mb-4">
							Informazioni sulle domande
						</h3>
						<hr className="mb-4" />
						<ul className="list-none pl-0">
							<div className="overflow-auto">
								<table className="min-w-full bg-white border text-sm mt-4">
									<thead>
										<tr>
											<th className="py-2 border text-center">Categoria</th>
											<th className="py-2 border text-center">Nome</th>
											<th className="py-2 border text-center">Testo</th>
											<th className="py-2 border text-center">Modifica</th>
											<th className="py-2 border text-center">Elimina</th>
										</tr>
									</thead>
									<tbody>
										{questions.map((question) => (
											<tr key={question.id} className="hover:bg-gray-200">
												<td className="py-2 text-center border">
													{question.category.name}
												</td>
												<td className="py-2 text-center border">
													{question.name}
												</td>
												<td className="py-2 text-left border px-2">
													{question.text}
												</td>
												<td className="py-2 text-center border">
													<div className="flex justify-center space-x-2">
														<button
															type="button"
															className="bg-navbar-hover text-white py-1 px-2 rounded"
															onClick={async () => {
																const data = await findSelectedQuestion(
																	question.documentId,
																);
																setSelectedQuestion(data);
																setIsQuestionModalOpen(true);
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
																	aria-hidden="true"
																>
																	<title>Modifica</title>
																	<path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
																	<path
																		fillRule="evenodd"
																		d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
																	/>
																</svg>
															</div>
														</button>
													</div>
												</td>
												<td className="py-2 text-center border">
													<div className="flex justify-center space-x-2">
														<button
															type="button"
															className="text-white bg-red-600 py-1 px-2 rounded"
															onClick={async () => {
																deleteQuestionModel(question.documentId);
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
																	aria-hidden="true"
																>
																	<title>Elimina</title>
																	<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
																</svg>
															</div>
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</ul>
					</div>
				</section>
			)}

			{/* Sezione per la modifica delle categorie*/}
			{selectedSection === "manageCategories" && (
				<section
					className="flex-1 bg-white p-6 shadow-md rounded"
					aria-labelledby="manageCategoriesHeading"
				>
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2
							id="manageCategoriesHeading"
							className="text-white font-bold font-accesible-font m-0 text-left text-[42px]"
						>
							Gestione delle Categorie
						</h2>
					</div>
					<div className="container py-8">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-bold font-accesible-font text-2xl text-navbar-hover">
								Lista Categorie
							</h3>
							<button
								type="button"
								className="bg-navbar text-white px-4 py-2 rounded"
								onClick={() => {
									setIsNew(true);
									setIsCategoryModalOpen(true);
								}}
							>
								Crea Nuova Categoria
							</button>
						</div>
						<hr className="mb-4" />
						<ul className="list-none pl-0">
							{categories.map((category) => (
								<li
									key={category.id_category}
									className="flex justify-between items-center p-2 rounded cursor-pointer"
								>
									<span>{category.name}</span>
									<div className="flex space-x-2">
										<button
											type="button"
											className="bg-navbar-hover text-white py-1 px-2 rounded"
											onClick={async () => {
												const data = await findSelectedCategory(
													category.documentId,
												);
												setSelectedCategory(data);
												setIsCategoryModalOpen(true);
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
													aria-hidden="true" // Nascondi l'icona agli screen reader
												>
													<title>Modifica</title>
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
												handleDeleteCategory(category.documentId);
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
													aria-hidden="true" // Nascondi l'icona agli screen reader
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
				</section>
			)}

			{/* Modale per la visualizzazione della domanda */}
			{isQuestionModalOpen && (
				<QuestionModal
					question={selectedQuestion ?? newQuestion}
					edit={true}
					onClose={() => {
						setIsQuestionModalOpen(false);
					}}
					onSave={() => {
						setIsQuestionModalOpen(false);
						localStorage.setItem("selectedSection", "manageQuestion");
						window.location.reload();
					}}
				/>
			)}

			{/* Modale per la visualizzazione della domanda */}
			{isQuestionModalOpen && isNew && (
				<QuestionModal
					question={newQuestion}
					onClose={() => {
						setIsNew(false);
						setIsQuestionModalOpen(false);
					}}
					onSave={() => {
						setIsNew(false);
						setIsQuestionModalOpen(false);
						localStorage.setItem("selectedSection", "manageQuestion");
						window.location.reload();
					}}
				/>
			)}

			{/* Modale per la visualizzazione della categoria */}
			{isCategoryModalOpen && isNew && (
				<CategoryModal
					category={newCategory}
					onClose={() => {
						setIsNew(false);
						setIsCategoryModalOpen(false);
						localStorage.setItem("selectedSection", "manageCategories");
						window.location.reload();
					}}
					onSave={() => setIsCategoryModalOpen(false)}
				/>
			)}

			{/* Modale per la visualizzazione della categoria */}
			{isCategoryModalOpen && !isNew && (
				<CategoryModal
					category={selectedCategory ?? newCategory}
					edit={true}
					onClose={() => {
						setIsCategoryModalOpen(false);
						localStorage.setItem("selectedSection", "manageCategories");
						window.location.reload();
					}}
					onSave={() => setIsCategoryModalOpen(false)}
				/>
			)}

			{/* Modale per la visualizzazione della categoria */}
		</div>
	);
};

export default DashboardPage;
