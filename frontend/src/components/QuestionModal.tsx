import type React from "react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Generatore di ID univoci
import CategoryModal from "./CategoryModal";

// Tipi TypeScript
export type Answer = {
	id: string;
	text: string;
	correction: string;
	score: number;
};

export type Question = {
	id: string;
	text: string;
	category: Category;
	answers: {
		id: string;
		text: string;
		correction: string;
		score: number;
	}[];
};

export type Category = {
	id_category: string;
	name: string;
};

interface QuestionModalProps {
	question?: Question;
	onClose: () => void;
	onSave: (question: {
		id: string;
		text: string;
		category: Category;
		answers: Answer[];
	}) => void;
}

// Functional Component principale per il modale di domande
const QuestionModal: React.FC<QuestionModalProps> = ({
	question,
	onClose,
	onSave,
}) => {
	const [text, setText] = useState<string>("");
	const [category, setCategory] = useState<Category>({
		id_category: "",
		name: "",
	});
	const [categories, setCategories] = useState<Category[]>([]);
	const [answers, setAnswers] = useState<Answer[]>([
		{ id: uuidv4(), text: "", score: 0, correction: "" },
	]);
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

	// Funzione per recuperare le categorie disponibili da STRAPI
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await fetch(
					"http://localhost:1337/api/test-plugin/get-categories",
				);
				const data = await response.json();
				console.log(data);

				if (data.length === 0) {
					setCategories([]);
				} else {
					setCategories(data);
				}
			} catch (error) {
				console.error("Errore nel recupero delle categorie:", error);
			}
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		if (question) {
			setText(question.text);
			setCategory(question.category);
			setAnswers(question.answers);
		}
	}, [question]);

	// Funzione per aggiungere una nuova risposta quando si clicca sul pulsante
	const addAnswer = () => {
		setAnswers((prevAnswers) => [
			...prevAnswers,
			{ id: uuidv4(), text: "", score: 0, correction: "" },
		]);
	};

	// Rimuove una risposta quando si clicca sul pulsante
	const removeAnswer = (id: string) => {
		setAnswers((prevAnswers) =>
			prevAnswers.filter((answer) => answer.id !== id),
		);
	};

	// Permette di aggioranre un campo di una risposta
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const updateAnswerField = (id: string, field: keyof Answer, value: any) => {
		setAnswers((prevAnswers) =>
			prevAnswers.map((answer) =>
				answer.id === id ? { ...answer, [field]: value } : answer,
			),
		);
	};

	// Gestisce l'aggiunta di una nuova categoria
	const handleAddCategory = (newCategory: Category) => {
		setCategories((prevCategories) => [...prevCategories, newCategory]);

		// imposto la nuova categoria come selezionata
		setCategory(newCategory);
	};

	// Gestisci il salvataggio della domanda
	const handleSave = () => {
		if (!text.trim() || !category.name.trim()) {
			alert("Completa tutti i campi obbligatori.");
			return;
		}

		// L'id della domanda è quello della domanda da modificare o un nuovo ID.
		const questionId = question ? question.id : uuidv4();

		// Passo i dati alla funzione onSave
		onSave({
			id: questionId,
			text,
			category: { id_category: category.id_category, name: category.name },
			answers,
		});
		onClose();
	};

	return (
		<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center font-poppins text-navbar-hover">
			<div className="bg-white w-11/12 max-w-2xl p-6 rounded shadow-lg">
				<div className="w-full bg-navbar-hover px-4 py-4 mb-4">
					<h3 className="font-bold text-white font-poppins text-center">
						Nuova Domanda
					</h3>
				</div>

				{/* Sezione della categoria */}
				<label htmlFor="category" className="block mb-2 font-poppins font-bold">
					Categoria
				</label>
				<div className="flex gap-2">
					<select
						id="category"
						value={category.name}
						onChange={(e) => {
							const selectedCategory = categories.find(
								(cat) => cat.name === e.target.value,
							);
							if (selectedCategory) {
								setCategory(selectedCategory);
							}
						}}
						className="w-full border rounded p-2 mb-4"
					>
						<option value="" disabled>
							Seleziona la categoria...
						</option>
						{categories.map((cat) => (
							<option key={cat.id_category} value={cat.name}>
								{cat.name}
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

				{/* Testo della domanda */}
				<label
					htmlFor="questionText"
					className="block mb-2 font-poppins font-bold"
				>
					Testo della Domanda
				</label>
				<input
					id="questionText"
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Inserisci il testo"
					className="w-full border rounded p-2 mb-4 font-poppins"
				/>

				{/* Sezione: Risposte */}
				<div className="mb-4">
					<h4 className="font-bold text-lg font-poppins mb-2">Risposte</h4>
					<div className="max-h-96 overflow-y-auto border rounded p-2 mb-4">
						{answers.length > 0 &&
							answers.map((answer) => (
								<div key={answer.id} className="flex items-center gap-3 mb-4">
									{/* Testo della risposta */}
									<textarea
										value={answer.text}
										onChange={(e) =>
											updateAnswerField(answer.id, "text", e.target.value)
										}
										placeholder="Testo della risposta"
										className="flex-1 border rounded p-2"
									/>

									{/* Correzione */}
									<textarea
										value={answer.correction}
										onChange={(e) =>
											updateAnswerField(answer.id, "correction", e.target.value)
										}
										placeholder="Correzione della risposta"
										className="flex-1 border rounded p-2"
									/>

									{/* Punteggio */}
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
										<option value={0.5}>0.25</option>
										<option value={0.5}>0.5</option>
										<option value={1}>1</option>
									</select>

									{/* Pulsante per rimuovere la risposta con icona cestino */}
									<button
										type="button"
										onClick={() => removeAnswer(answer.id)}
										className="text-red-600"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											fill="currentColor"
											className="bi bi-trash-fill"
											viewBox="0 0 16 16"
										>
											<title>Icona rimuovi</title>
											<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
										</svg>
									</button>
								</div>
							))}
					</div>
					<button
						onClick={addAnswer}
						type="button"
						className="bg-navbar-hover text-white font-poppins py-2 px-4 rounded"
					>
						Aggiungi Risposta
					</button>
				</div>

				<div className="flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="bg-red-600 px-4 py-2 rounded mr-2 text-white"
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
