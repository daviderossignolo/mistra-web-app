import { useState } from "react";
import QuestionSidebar from "./QuestionSidebar";
import QuestionModal from "./QuestionModal";

interface QuizData {
	questions: Question[];
	name: string;
}

interface Question {
	id: string;
	text: string;
	category: string;
}

interface QuestionSelectionStepProps {
	quizData: QuizData;
	onPrevious: () => void;
	onNext: (data: { questions: Question[] }) => void;
}
/**
 * TODO: Sistemare aggiunta delle domande, le domande devono poter essere modificate ed eliminate e in pià manca lo score,
 * la correzione.
 * Nella sidebar devono essere visualizzate le domande già presenti nel database mentre nella parte centrale si devono vedere le domande aggiunte
 * al quiz corrente.
 *
 */
const QuestionSelectionStep = ({
	quizData,
	onPrevious,
	onNext,
}: QuestionSelectionStepProps) => {
	const [questions, setQuestions] = useState(quizData.questions || []);
	const [isModalOpen, setModalOpen] = useState(false);

	const handleAddQuestion = (newQuestion: Question) => {
		setQuestions((prev: Question[]) => [...prev, newQuestion]);
		setModalOpen(false);
	};

	const handleSave = () => {
		onNext({ questions });
	};

	return (
		<div className="flex">
			{/* Main content */}
			<div className="flex-grow p-6">
				<h2 className="text-xl font-semibold mb-4">
					Domande del Test: {quizData.name}
				</h2>
				<div className="mb-4">
					{questions.map((question) => (
						<div key={question.id} className="bg-gray-100 p-4 mb-2">
							<p className="font-semibold">{question.text}</p>
							<p className="text-sm text-gray-500">{question.category}</p>
						</div>
					))}
				</div>
				<div className="mb-4">
					<button
						type="button"
						onClick={() => setModalOpen(true)}
						className="bg-green-500 text-white py-2 px-4 rounded"
					>
						Aggiungi Nuova Domanda
					</button>
				</div>
				<button
					type="button"
					onClick={onPrevious}
					className="bg-gray-300 py-2 px-4 rounded mr-2"
				>
					Indietro
				</button>
				<button
					type="button"
					onClick={handleSave}
					className="bg-blue-500 text-white py-2 px-4 rounded"
				>
					Salva Quiz
				</button>
			</div>

			{/* Question Modal */}
			{isModalOpen && (
				<QuestionModal
					onClose={() => setModalOpen(false)}
					onSave={handleAddQuestion}
				/>
			)}
		</div>
	);
};

export default QuestionSelectionStep;
