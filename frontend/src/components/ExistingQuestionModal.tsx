import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Question } from "./QuestionModal";

interface ExistingQuestionModal {
	onClose: () => void;
	onSave: (question: Question) => void;
}

// Componente per il modale di creazione categoria
const ExistingQuestionModal: React.FC<ExistingQuestionModal> = ({
	onClose,
	onSave,
}) => {
	const host = process.env.REACT_APP_BACKEND_HOST;
	const port = process.env.REACT_APP_BACKEND_PORT;
	const service_key = process.env.SERVICE_KEY;

	const [selectedQuestion, setSelectedQuestion] = useState<Question>(
		{} as Question,
	);
	const [questions, setQuestions] = useState<Question[]>([]);

	// Funzione che gestisce
	const handleSave = async () => {
		if (!selectedQuestion.documentId) {
			alert("Seleziona una domanda");
			return;
		}

		// Trovo le risposte legate alla domanda
		const token = localStorage.getItem("token");
		const response = await fetch(
			`${host}:${port}/api/test-plugin/get-question-answers?documentId=${selectedQuestion.documentId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!response.ok) {
			alert("Errore durante il recupero delle risposte");
			return;
		}

		const data = await response.json();
		selectedQuestion.answers = data;

		onSave(selectedQuestion);
		onClose();
	};

	useEffect(() => {
		const fetchQuestion = async () => {
			const token = localStorage.getItem("token");
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
				throw new Error("Errore durante il recupero delle domande");
			}

			const data = await response.json();
			console.log(data);
			setQuestions(data);
		};

		fetchQuestion();
	}, [host, port]);

	return (
		<div
			className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center font-poppins text-navbar-hover"
			aria-modal="true"
			// biome-ignore lint/a11y/useSemanticElements: <explanation>
			role="dialog"
			aria-labelledby="existingQuestionModalHeading"
		>
			<div
				className="bg-white w-8/12 max-w-ld p-4 rounded shadow-lg"
				aria-labelledby="existingQuestionModalHeading"
			>
				<div className="w-full bg-navbar-hover px-4 py-4 mb-4">
					<h3
						id="existingQuestionModalHeading"
						className="font-bold text-center text-white"
					>
						Domande Esistenti
					</h3>
				</div>

				<form aria-label="Form selezione domanda esistente">
					<p>Seleziona un quiz esistente che vuoi aggiungere al test</p>
					<div className="mb-4">
						<label
							htmlFor="questionSelect"
							className="block mb-2 font-bold font-poppins"
						>
							Seleziona una domanda
						</label>
						<select
							id="questionSelect"
							value={selectedQuestion.documentId}
							onChange={(e) => {
								const question = questions.find(
									(q) => q.documentId === e.target.value,
								);
								setSelectedQuestion(question ?? ({} as Question));
							}}
							className="w-full border rounded p-2 mb-4"
						>
							<option value="" disabled>
								Seleziona una domanda
							</option>
							{questions.map((question) => (
								<option key={question.id} value={question.documentId}>
									{question.text}
								</option>
							))}
						</select>
					</div>

					<div className="flex justify-end">
						<button
							type="button"
							onClick={onClose}
							className="bg-red-600 text-white px-4 py-2 rounded mr-2"
						>
							Annulla
						</button>
						<button
							type="button"
							onClick={handleSave}
							className="bg-navbar-hover text-white px-4 py-2 rounded"
						>
							Salva
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ExistingQuestionModal;
