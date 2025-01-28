import { useState } from "react";
import QuestionModal, { type Question } from "./QuestionModal";

interface QuestionSelectionStepProps {
	quizData: QuizData;
	onPrevious: (questions: Question[]) => void;
	onNext: (data: { questions: Question[] }) => void;
}

type QuizData = {
	id: string;
	name: string;
	description: string;
	questions: Question[];
};

const QuestionSelectionStep = ({
	quizData,
	onPrevious,
	onNext,
}: QuestionSelectionStepProps) => {
	const [questions, setQuestions] = useState(quizData.questions || []);
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState<Question>();

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

	// Elimina la domanda dalla lista
	const handleDeleteQuestion = (id: string) => {
		setQuestions((prev: Question[]) =>
			prev.filter((question) => question.id !== id),
		);
	};

	// Funzione che viene chiamata quando l'utente clicca sul pulsante di modifica di una domanda
	const handleEditQuestion = (question: Question) => {
		setSelectedQuestion(question);
		setModalOpen(true);
	};

	/**
	 * TODO: BRAGA, compila la richiesta al backend per salvare il quiz
	 * Gestione del salvataggio del quiz, questa funzione chiama l'API corrispondente sul plugin e invia il quiz
	 * appena creato per il salvataggio nel database.
	 */
	const handleSave = async () => {
		// costruzione del quiz
		const quiz = {
			id: quizData.id,
			name: quizData.name,
			description: quizData.description,
			questions,
		};
		console.log(quiz);

		// chiamata API per salvare il quiz
		// try {
		// 	const response = await fetch("h", {
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 		},
		// 		body: JSON.stringify(quiz),
		// 	});

		// 	// Se la risposta è ok, allora navigo alla pagina di visualizzazione del quiz
		// 	if (response.ok) {
		// 		window.close();
		// 	}

		// 	// Se la risposta non è ok, lancio un errore
		// 	if (!response.ok) {
		// 		throw new Error("Errore durante il salvataggio della categoria");
		// 	}
		// } catch (error) {
		// 	alert("Si è verificato un errore durante il salvataggio del test.");
		// }
	};

	return (
		<div className="flex">
			<div className="flex-grow p-6">
				<h2 className="text-xl font-semibold mb-4">
					Domande del Test: {quizData.name}
				</h2>
				<div className="mb-4">
					{questions.map((question, index) => (
						<div
							key={question.id}
							className="p-4 mb-2 border rounded shadow-sm flex justify-between items-center"
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
									className="text-navbar-hover"
									onClick={() => handleEditQuestion(question)}
								>
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
								</button>
								<button
									type="button"
									className="text-red-600"
									onClick={() => handleDeleteQuestion(question.id)}
								>
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
								</button>
							</div>
						</div>
					))}
				</div>
				<div className="mb-4">
					<button
						type="button"
						onClick={() => setModalOpen(true)}
						className="bg-navbar-hover text-white py-2 px-4 rounded"
					>
						Aggiungi Nuova Domanda
					</button>
				</div>
				<button
					type="button"
					onClick={() => onPrevious(questions)}
					className="bg-gray-300 py-2 px-4 rounded mr-2"
				>
					Indietro
				</button>
				<button
					type="button"
					onClick={handleSave}
					className="bg-navbar-hover text-white py-2 px-4 rounded"
				>
					Salva Quiz
				</button>
			</div>

			{/* Question Modal */}
			{isModalOpen && (
				<QuestionModal
					question={selectedQuestion}
					onClose={() => setModalOpen(false)}
					onSave={handleAddQuestion}
				/>
			)}
		</div>
	);
};

export default QuestionSelectionStep;
