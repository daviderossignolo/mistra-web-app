import type React from "react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Generatore di ID univoci
import CategoryModal from "./CategoryModal";

// Tipi TypeScript
interface Answer {
	id: string;
	text: string;
	correction: string;
	score: number;
}

interface QuestionModalProps {
	onClose: () => void;
	onSave: (question: {
		id: string;
		text: string;
		category: string;
		answers: Answer[];
	}) => void;
}

// Functional Component principale per il modale di domande
const QuestionModal: React.FC<QuestionModalProps> = ({ onClose, onSave }) => {
	const [text, setText] = useState<string>(""); // Stato per il testo della domanda
	const [category, setCategory] = useState<string>(""); // Stato per la categoria
	const [categories, setCategories] = useState<string[]>([
		"categoria1",
		"categoria2",
		"categoria3",
	]); // Stato per le categorie disponibili
	const [answers, setAnswers] = useState<Answer[]>([
		{ id: uuidv4(), text: "", score: 0, correction: "" },
	]); // Stato per le risposte
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // Stato per il modale delle categorie

	// Aggiungi una nuova risposta vuota
	const addAnswer = () => {
		setAnswers((prevAnswers) => [
			...prevAnswers,
			{ id: uuidv4(), text: "", score: 0, correction: "" },
		]);
	};

	// Rimuovi una risposta
	const removeAnswer = (id: string) => {
		setAnswers((prevAnswers) =>
			prevAnswers.filter((answer) => answer.id !== id),
		);
	};

	// Gestisci i campi di testo e aggiornamenti delle risposte
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const updateAnswerField = (id: string, field: keyof Answer, value: any) => {
		setAnswers((prevAnswers) =>
			prevAnswers.map((answer) =>
				answer.id === id ? { ...answer, [field]: value } : answer,
			),
		);
	};

	// Gestisci l'aggiunta di una nuova categoria
	const handleAddCategory = (newCategory: string) => {
		setCategories((prevCategories) => [...prevCategories, newCategory]);
		setCategory(newCategory); // Imposta la nuova categoria come selezionata
	};

	// Gestisci il salvataggio della domanda
	const handleSave = () => {
		if (!text.trim() || !category.trim()) {
			alert("Completa tutti i campi obbligatori."); // Validazione semplice
			return;
		}

		// Passa il nuovo oggetto al callback `onSave`
		onSave({
			id: uuidv4(), // Genera un ID univoco per la domanda
			text,
			category,
			answers,
		});
		onClose(); // Chiudi il modal dopo il salvataggio
	};

	return (
		<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center font-poppins text-navbar-hover">
			<div className="bg-white w-11/12 max-w-2xl p-6 rounded shadow-lg">
				<h3 className="text-xl font-bold mb-4">Nuova Domanda</h3>
				<label htmlFor="category" className="block mb-2 font-medium">
					Categoria
				</label>
				<div className="flex gap-2 items-end">
					<select
						id="category"
						value={category}
						onChange={(e) => setCategory(e.target.value)}
						className="w-full border rounded p-2 mb-4"
					>
						<option value="" disabled>
							Seleziona la categoria..
						</option>
						{categories.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>
					<button
						type="button"
						onClick={() => setIsCategoryModalOpen(true)}
						className="bg-navbar-hover text-white px-4 py-2 rounded mb-4"
					>
						Nuova
					</button>
				</div>
				<label htmlFor="questionText" className="block mb-2 font-medium">
					Testo della Domanda
				</label>
				<input
					id="questionText"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Inserisci il testo"
					className="w-full border rounded p-2 mb-4"
				/>

				{/* Sezione: Risposte */}
				<div className="mb-4">
					<h4 className="font-medium text-lg mb-2">Risposte</h4>
					<div className="max-h-96 overflow-y-auto border rounded p-2 mb-4">
						{/* La lista di risposte */}
						{answers.length > 0 &&
							answers.map((answer) => (
								<div key={answer.id} className="flex items-center gap-3 mb-4">
									<textarea
										value={answer.text}
										onChange={(e) =>
											updateAnswerField(answer.id, "text", e.target.value)
										}
										placeholder="Testo della risposta"
										className="flex-1 border rounded p-2"
									/>
									<textarea
										value={answer.correction}
										onChange={(e) =>
											updateAnswerField(answer.id, "correction", e.target.value)
										}
										placeholder="Correzione della risposta"
										className="flex-1 border rounded p-2"
									/>
									<select
										value={answer.score}
										onChange={(e) =>
											updateAnswerField(
												answer.id,
												"score",
												Number.parseFloat(e.target.value),
											)
										}
										className="border rounded p-2"
									>
										<option value={0}>0</option>
										<option value={0.5}>0.5</option>
										<option value={1}>1</option>
									</select>
									<button
										type="button"
										onClick={() => removeAnswer(answer.id)}
										className="text-red-500 font-bold hover:text-red-700"
									>
										X
									</button>
								</div>
							))}
					</div>
					<button
						onClick={addAnswer}
						type="button"
						className="bg-navbar-hover text-white py-2 px-4 rounded"
					>
						Aggiungi Risposta
					</button>
				</div>

				<div className="flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="bg-red-700 px-4 py-2 rounded mr-2 text-white"
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
			</div>

			{/* Modale per la creazione di una nuova categoria */}
			{isCategoryModalOpen && (
				<CategoryModal
					onClose={() => setIsCategoryModalOpen(false)}
					onSave={handleAddCategory}
				/>
			)}
		</div>
	);
};

export default QuestionModal;
