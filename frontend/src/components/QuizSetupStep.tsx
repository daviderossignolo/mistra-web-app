import { useState } from "react";

interface QuizData {
	name: string;
	description: string;
}

interface QuizSetupStepProps {
	quizData: QuizData;
	onNext: (data: QuizData) => void;
}

const QuizSetupStep: React.FC<QuizSetupStepProps> = ({ quizData, onNext }) => {
	// setto gli stati iniziali con i dati del quiz che ho passato come props alla pagina
	const [name, setName] = useState(quizData.name);
	const [description, setDescription] = useState(quizData.description);

	// funzione che gestisce il passaggio al prossimo step della compilazione del test
	const handleNext = () => {
		if (!name || name === "") {
			return alert("Il nome è obbligatorio per creare un quiz");
		}

		if (!description || description === "") {
			return alert("La descrizione è obbligatoria per creare un quiz");
		}

		// passo i dati del quiz al prossimo step
		onNext({ name, description });
	};

	return (
		<div>
			<h2 className="text-xl font-bold mb-4 font-poppins">
				Crea un nuovo quiz
			</h2>
			<div className="mb-4">
				<label
					htmlFor="quiz-name"
					className="block text-sm font-medium mb-2 font-poppins"
				>
					Nome
				</label>
				<input
					id="quiz-name"
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full p-2 border rounded font-poppins"
				/>
			</div>
			<div className="mb-4">
				<label
					htmlFor="quiz-description"
					className="block text-sm font-medium mb-2 font-poppins"
				>
					Descrizione
				</label>
				<textarea
					id="quiz-description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full p-2 border rounded font-poppins"
				/>
			</div>
			<button
				type="button"
				onClick={handleNext}
				className="bg-navbar text-white py-2 px-4 rounded font-poppins"
			>
				Avanti
			</button>
		</div>
	);
};

export default QuizSetupStep;
