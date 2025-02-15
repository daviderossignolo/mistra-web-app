import type React from "react";
import { useState } from "react";
import type { Question } from "./QuestionModal";
import QuestionModal from "./QuestionModal";
import { v4 as uuidv4 } from "uuid";
import ExistingQuestionModal from "./ExistingQuestionModal";

interface QuestionSelectionStepProps {
	quizData: QuizData;
	edit: boolean;
	readOnly: boolean;
}

export type QuizData = {
	id: string;
	documentId: string;
	name: string;
	description: string;
	questions: Question[];
};

const QuestionSelectionStep: React.FC<QuestionSelectionStepProps> = ({
	quizData,
	edit,
	readOnly,
}) => {
	// Stati per il quiz
	const [id, setId] = useState<string>(quizData.id || uuidv4());
	const [name, setName] = useState<string>(quizData.name || "");
	const [description, setDescription] = useState<string>(
		quizData.description || "",
	);
	const [questions, setQuestions] = useState(quizData.questions || []);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState<Question>();
	const [openQuestionModal, setOpenQuestionModal] = useState(false);

	// Questa funzione viene chiamata quando l'utente aggiunge una nuova domanda
	const handleAddQuestion = (newQuestion: Question) => {
		// Se la domanda è già presente nella lista, allora la sostituisco
		const existingQuestion = questions.find(
			(question) => question.id === newQuestion.id,
		);

		// rimuovo la domanda esistente
		if (existingQuestion) {
			setQuestions((prev) =>
				prev.filter((question) => question.id !== newQuestion.id),
			);
		}

		setQuestions((prev) => [...prev, newQuestion]);
		setModalOpen(false);
	};

	// Variabili d'ambiente
	const host = process.env.REACT_APP_BACKEND_HOST;
	const port = process.env.REACT_APP_BACKEND_PORT;
	const token = localStorage.getItem("token");

	const [isNew, setIsNew] = useState(false);

	// Elimina la domanda dalla lista
	const handleDeleteQuestion = async (id: string) => {
		setQuestions((prev: Question[]) =>
			prev.filter((question) => question.documentId !== id),
		);

		if (edit) {
			// Faccio la chiamata API per eliminare la domanda dal database
			const deletedQuestions = await fetch(
				`${host}:${port}/api/test-plugin/delete-question-in-test`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						documentId: id,
					}),
				},
			);

			if (!deletedQuestions.ok) {
				alert("Errore durante l'eliminazione della domanda.");
			}

			if (deletedQuestions.ok) {
				alert("Domanda eliminata con successo.");
			}
		}
	};

	// Funzione che viene chiamata quando l'utente clicca sul pulsante di modifica di una domanda
	const handleEditQuestion = (question: Question) => {
		setSelectedQuestion(question);
		setModalOpen(true);
	};

	const handleSave = async () => {
		if (!edit) {
			if (!name || !description) {
				// Se non ci sono nome o descrizione, allora non posso salvare il quiz
				alert("Inserisci un nome e una descrizione per il quiz.");
				return;
			}

			// costruzione del quiz
			const quiz = {
				id: id,
				name: name,
				description: description,
				questions: questions,
			};

			// chiamata API per salvare il quiz
			try {
				const token = localStorage.getItem("token");

				const response = await fetch(
					"http://localhost:1337/api/test-plugin/create-test",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(quiz),
					},
				);

				// Se la risposta è ok, allora navigo alla pagina di visualizzazione del quiz
				if (response.status === 200) {
					alert("Il test è stato salvato con successo.");
					localStorage.setItem("selectedSection", "testTemplates");
					window.location.reload();
				}

				// Se la risposta non è ok, lancio un errore
				if (!response.ok) {
					throw new Error(
						`Status: ${response.status}, Message: ${response.statusText}`,
					);
				}
			} catch (error) {
				alert(error);
			}
		} else {
			// costruzione del quiz
			const quiz = {
				id: id,
				name: name,
				documentId: quizData.documentId,
				description: description,
				questions: questions,
			};

			// chiamata API per salvare il quiz
			try {
				const token = localStorage.getItem("token");

				const response = await fetch(
					"http://localhost:1337/api/test-plugin/submit-modify-test",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(quiz),
					},
				);

				// Se la risposta è ok, allora navigo alla pagina di visualizzazione del quiz
				if (response.status === 200) {
					alert("Il test è stato salvato con successo.");
					localStorage.setItem("selectedSection", "testTemplates");
					window.location.reload();
				}

				// Se la risposta non è ok, lancio un errore
				if (!response.ok) {
					throw new Error(
						`Status: ${response.status}, Message: ${response.statusText}`,
					);
				}
			} catch (error) {
				alert(error);
			}
		}
	};

	return (
		<div className="flex">
			<section className="flex-grow p-6" aria-labelledby="quizInfoHeading">
				<h2
					id="quizInfoHeading"
					className="font-bold font-accesible-font text-2xl text-navbar-hover mb-4"
				>
					Informazioni sul test
				</h2>
				<hr className="mb-4" />
				<form aria-label="Form informazioni quiz">
					<div className="mb-4">
						<label
							htmlFor="quizName"
							className="block mb-2 font-accesible-font font-bold text-lg text-navbar-hover"
						>
							Nome del Quiz
						</label>
						<input
							type="text"
							id="quizName"
							placeholder="Inserisci il nome del quiz..."
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="w-full border rounded-lg p-3 mb-4 font-accesible-font shadow-sm focus:outline-none focus:ring-2 focus:ring-navbar-hover focus:border-transparent"
						/>
					</div>
					<div className="mb-4">
						<label
							htmlFor="quizDescription"
							className="block mb-2 font-accesible-font font-bold text-lg text-navbar-hover"
						>
							Descrizione del Quiz
						</label>
						<textarea
							id="quizDescription"
							value={description}
							placeholder="Inserisci una descrizione del quiz..."
							onChange={(e) => setDescription(e.target.value)}
							className="w-full border rounded-lg p-3 mb-4 font-accesible-font shadow-sm focus:outline-none focus:ring-2 focus:ring-navbar-hover focus:border-transparent"
						/>
					</div>
				</form>
				<div className="mb-6">
					<h3
						className="font-bold font-accesible-font text-2xl text-navbar-hover mb-4"
						id="questionListHeading"
					>
						Domande
					</h3>
					<hr className="mb-4" />
					<ul aria-labelledby="questionListHeading" className="list-none pl-0">
						{questions.map((question, index) => (
							<li
								key={question.id}
								className="p-4 mb-4 border rounded shadow-sm flex justify-between items-center"
							>
								<div>
									<p className="text-sm text-gray-500">
										{question.category.name}
									</p>
									<p className="font-semibold">
										{index + 1}. {question.text}
									</p>
								</div>
								<div className="flex space-x-2">
									<button
										type="button"
										className="bg-navbar-hover text-white py-1 px-2 rounded"
										onClick={() => handleEditQuestion(question)}
										aria-label={
											readOnly
												? `Visualizza Domanda ${question.name}`
												: `Modifica domanda ${question.name}`
										}
									>
										<div className="flex items-center space-x-1">
											<span>{readOnly ? "Visualizza" : "Modifica"}</span>
											{readOnly && (
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
											)}
											{!readOnly && (
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
														fill-rule="evenodd"
														d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
													/>
												</svg>
											)}
										</div>
									</button>

									<button
										type="button"
										className="text-white bg-red-600 py-1 px-2 rounded"
										onClick={() => handleDeleteQuestion(question.documentId)}
										aria-label={`Elimina domanda ${question.name}`}
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
				<div className="mb-6">
					<div className="flex">
						<button
							type="button"
							onClick={() => {
								setIsNew(true);
								setModalOpen(true);
							}}
							className="bg-navbar-hover text-white py-2 px-6 m-1 rounded shadow-md hover:bg-navbar-hover-dark transition duration-300"
						>
							Aggiungi Nuova Domanda
						</button>
						<button
							type="button"
							onClick={() => {
								setOpenQuestionModal(true);
							}}
							className="bg-navbar-hover text-white py-2 px-6 m-1 rounded shadow-md hover:bg-navbar-hover-dark transition duration-300"
						>
							Aggiungi Domanda Esistente
						</button>
					</div>
				</div>
				<div className="flex justify-end mt-8">
					<button
						type="button"
						onClick={handleSave}
						className="bg-navbar-hover text-white py-2 px-4 rounded"
					>
						Salva Quiz
					</button>
				</div>
			</section>

			{/* Modale per le nuove domande */}
			{isModalOpen && isNew && (
				<QuestionModal
					question={selectedQuestion}
					onClose={() => {
						setIsNew(false);
						setModalOpen(false);
						setSelectedQuestion(undefined);
					}}
					onSave={handleAddQuestion}
				/>
			)}

			{isModalOpen && !isNew && (
				<QuestionModal
					question={selectedQuestion}
					edit={edit}
					view={readOnly}
					onClose={() => {
						setModalOpen(false);
						setSelectedQuestion(undefined);
					}}
					onSave={handleAddQuestion}
				/>
			)}

			{/* Modale per le domande esistenti */}
			{openQuestionModal && (
				<ExistingQuestionModal
					questionsTest={questions}
					onClose={() => setOpenQuestionModal(false)}
					onSave={handleAddQuestion}
				/>
			)}
		</div>
	);
};

export default QuestionSelectionStep;
