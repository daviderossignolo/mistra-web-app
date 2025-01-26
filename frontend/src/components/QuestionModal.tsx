import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Answer {
	id: string;
	text: string;
	isCorrect: boolean;
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

const QuestionModal = ({ onClose, onSave }: QuestionModalProps) => {
	const [text, setText] = useState("");
	const [category, setCategory] = useState("");
	const [answers, setAnswers] = useState<Answer[]>([]);

	const addAnswer = () => {
		setAnswers((prev: Answer[]) => [
			...prev,
			{ id: uuidv4(), text: "", isCorrect: false },
		]);
	};

	const handleSave = () => {
		if (!text.trim() || !category.trim()) {
			return alert("Completa tutti i campi obbligatori.");
		}
		onSave({ id: uuidv4(), text, category, answers });
	};

	return (
		<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
			<div className="bg-white p-6 rounded">
				<h3 className="text-xl font-bold">Nuova Domanda</h3>
				<input
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Testo della domanda"
					className="w-full border rounded p-2 mb-4"
				/>
				<input
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					placeholder="Categoria"
					className="w-full border rounded p-2 mb-4"
				/>
				<div className="mb-4">
					<h4>Risposte</h4>
					{answers.map((answer: Answer, index: number) => (
						<input
							key={answer.id}
							value={answer.text}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const updatedAnswers = [...answers];
								updatedAnswers[index].text = e.target.value;
								setAnswers(updatedAnswers);
							}}
							placeholder={`Risposta ${index + 1}`}
							className="w-full border rounded p-2 mb-2"
						/>
					))}
					<button
						type="button"
						onClick={addAnswer}
						className="bg-blue-500 text-white py-1 px-2 rounded"
					>
						Aggiungi Risposta
					</button>
				</div>
				<div className="flex justify-end">
					<button
						type="button"
						onClick={onClose}
						className="bg-gray-300 px-4 py-2 rounded mr-2"
					>
						Annulla
					</button>
					<button
						type="button"
						onClick={handleSave}
						className="bg-green-500 text-white px-4 py-2 rounded"
					>
						Salva
					</button>
				</div>
			</div>
		</div>
	);
};

export default QuestionModal;
