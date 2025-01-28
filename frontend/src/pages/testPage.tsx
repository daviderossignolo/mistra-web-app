import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import QuestionSelectionStep from "../components/QuizSelectionStep";
import QuizSetupStep from "../components/QuizSetupStep";
import type { Question } from "../components/QuestionModal";

type QuizData = {
	id: string;
	name: string;
	description: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	questions: any[];
};

type StepData = {
	name?: string;
	description?: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	questions?: any[];
};

const TestPage: React.FC = () => {
	const navigate = useNavigate();
	// imposto lo stato iniziale alla pagina di creazione del test
	const [currentStep, setCurrentStep] = useState(1);

	// definisco lo stato iniziale del test
	const [quizData, setQuizData] = useState<QuizData>({
		id: uuidv4(),
		name: "",
		description: "",
		questions: [],
	});

	// funzione per controllare che l'utente che accede alla pagina sia loggato
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			navigate("/login");
		}
	}, [navigate]);

	// funzione che gestisce il passaggio al prossimo step della compilazione del test
	const handleNextStep = (data: StepData) => {
		// aggiorno lo stato del test con i dati che l'utente ha appena inserito e aggiorno il currentStep
		setQuizData((prev: QuizData) => ({ ...prev, ...data }));
		setCurrentStep((prev: number) => prev + 1);
	};

	// funzion che gestische il passaggio allo stato precedente, in modo da tornare indietro
	const handlePreviousStep = (questions: Question[]) => {
		setQuizData((prev) => ({ ...prev, questions }));

		setCurrentStep((prev) => prev - 1);
	};

	return (
		<div className="flex justify-center items-center bg-gray-100 py-8">
			<div className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 w-4/5">
				<div className="w-full bg-navbar-hover px-4 py-4">
					<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
						CREAZIONE QUIZ
					</h2>
				</div>
				<div className="w-full px-4 py-4">
					{currentStep === 1 && (
						<QuizSetupStep
							quizData={quizData}
							onNext={(data) => {
								handleNextStep(data);
							}}
						/>
					)}
					{currentStep === 2 && (
						<QuestionSelectionStep
							quizData={quizData}
							onPrevious={(questions) => handlePreviousStep(questions)}
							onNext={handleNextStep}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default TestPage;
