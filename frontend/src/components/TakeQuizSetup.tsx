import type React from "react";
import { useEffect, useState } from "react";

interface Answer {
	id: string;
	text: string;
	correction: string;
	score: number;
}

interface Question {
	id: string;
	text: string;
	answers: Answer[];
}

interface QuizData {
	name: string;
	description: string;
	questions: Question[];
}

interface Mistake {
	questionText: string;
	correction: string;
}

interface TakeQuizSetupProps {
	quizData: QuizData;
}

/**
 * TODO: Recuperare un quiz a caso da database, chiedere età e sesso all'utente, generare un codice di esecuzione del test casuale (data formato iso + 3 lettere)
 * una volta ottenute le risposte e quando l'utente conferma salva il risultato e indica all'utente il codice dell'esecuzione. Deve quindi mostrare per ogni domanda
 * la risposta data dall'utente e se errata la spiegazione associata, non si deve vedere la risposta corretta. Il tutto deve poter essere salvato come pdf.
 *
 */

const TakeQuizSetup: React.FC = () => {
	const [step, setStep] = useState(0);
	const [userData, setUserData] = useState({ sex: "", age: "" });
	const [testCode, setTestCode] = useState("");
	const [selectedAnswers, setSelectedAnswers] = useState<{
		[key: string]: string;
	}>({});
	const [score, setScore] = useState(0);
	const [mistakes, setMistakes] = useState<Mistake[]>([]);
	const [quizData, setQuizData] = useState<QuizData>();

	const host = process.env.REACT_APP_BACKEND_HOST;
	const port = process.env.REACT_APP_BACKEND_PORT;

	const handleUserDataSubmit = () => {
		if (userData.sex && userData.age) {
			setStep(1);
		} else {
			alert("Per favore, inserisci sesso ed età.");
		}
	};

	useEffect(() => {
		const fetchRandomTest = async () => {
			try {
				const randomTestResponse = await fetch(
					`${host}:${port}/api/test-plugin/get-random-test`,
				);
				console.log("Risposta ricevuta: ", randomTestResponse);

				if (randomTestResponse.ok) {
					const randomTest = await randomTestResponse.json();
					console.log("Test ricevuto: ", randomTest);
				} else {
					throw new Error("Errore nel recupero del test.");
				}
			} catch (error) {
				console.error("Errore durante il recupero del test:", error);
			}
		};

		fetchRandomTest();
	}, [host, port]);

	const handleAnswerSelect = (questionId: string, answerId: string) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionId]: answerId,
		}));
	};

	const handleQuizSubmit = () => {
		let totalScore = 0;
		const wrongAnswers: Mistake[] = [];

		if (!quizData) return;
		for (const question of quizData.questions) {
			const selectedAnswerId = selectedAnswers[question.id];
			const correctAnswer = question.answers.find(
				(a) => a.correction === "correct" && a.id === selectedAnswerId,
			);

			if (correctAnswer) {
				totalScore += correctAnswer.score;
			} else {
				const wrongAnswer = question.answers.find(
					(a) => a.correction === "wrong",
				);
				if (wrongAnswer) {
					wrongAnswers.push({
						questionText: question.text,
						correction: wrongAnswer.text,
					});
				}
			}
		}

		// Set final score and mistakes
		setScore(totalScore);
		setMistakes(wrongAnswers);
		setStep(2);
	};

	if (step === 0) {
		// User Setup Step
		return (
			<div className="flex justify-center items-center bg-gray-100 py-8 font-poppins text-navbar-hover">
				<div className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 w-4/5">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
							Inserisci i tuoi dati
						</h2>
					</div>
					<div className="w-full max-w-md">
						<div className="mb-4 mt-4">
							<label htmlFor="sex" className="block text-sm font-bold mb-2">
								Sesso
							</label>
							<select
								id="sex"
								value={userData.sex}
								onChange={(e) =>
									setUserData({ ...userData, sex: e.target.value })
								}
								className="border rounded w-full py-2 px-3"
							>
								<option value="">Seleziona...</option>
								<option value="male">Maschio</option>
								<option value="female">Femmina</option>
								<option value="other">Altro</option>
							</select>
						</div>
						<div className="mb-4">
							<label htmlFor="age" className="block text-sm font-bold mb-2">
								Età
							</label>
							<input
								id="age"
								type="number"
								value={userData.age}
								onChange={(e) =>
									setUserData({ ...userData, age: e.target.value })
								}
								className="border rounded w-full py-2 px-3"
								min={1}
							/>
						</div>
						<button
							type="button"
							onClick={handleUserDataSubmit}
							className="bg-navbar-hover text-white font-bold py-2 px-4 rounded"
						>
							Iniziamo il Quiz
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (step === 1) {
		// Quiz Step
		return (
			<div className="flex justify-center items-center bg-gray-100 py-8 font-poppins text-navbar-hover">
				<div className="flex flex-col bg-white shadow-md rounded-lg p-4 w-4/5">
					{quizData && (
						<>
							<div className="w-full bg-navbar-hover px-4 py-4">
								<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
									{quizData.name}
								</h2>
							</div>
							<div className="bg-gray-200 p-4 mt-2 rounded-lg mb-6">
								<h3 className="text-lg font-semibold mb-2">Descrizione</h3>
								<p className="text-navbar-hover text-left">
									{quizData.description}
								</p>
							</div>
						</>
					)}

					{quizData?.questions.map((question, index) => (
						<div key={question.id} className="mb-6">
							<h2 className="text-lg font-medium mb-4">
								Domanda {index + 1}: {question.text}
							</h2>
							<div className="flex flex-row space-x-2">
								{question.answers.map((answer) => (
									<button
										type="button"
										key={answer.id}
										onClick={() => handleAnswerSelect(question.id, answer.id)}
										className={`p-3 rounded border ${
											selectedAnswers[question.id] === answer.id
												? "bg-blue-500 text-white"
												: "bg-white text-gray-700"
										} hover:bg-blue-200`}
									>
										{answer.text}
									</button>
								))}
							</div>
						</div>
					))}
					<div className="mt-6 flex justify-end">
						<button
							type="button"
							onClick={handleQuizSubmit}
							className="bg-navbar-hover text-white font-bold py-2 px-4 rounded"
						>
							Concludi Test
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (step === 2) {
		// Result Step
		return (
			<div className="flex justify-center items-center bg-gray-100 py-8 font-poppins text-navbar-hover">
				<div className="flex flex-col bg-white shadow-md rounded-lg p-4 w-4/5 relative">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
							Risultati
						</h2>
					</div>
					{mistakes.length > 0 ? (
						<div className="p-6 w-full max-w-2xl">
							<h2 className="text-lg font-bold mb-4">Domande Sbagliate</h2>
							{mistakes.map((mistake) => (
								<div key={mistake.questionText} className="mb-4">
									<p className="text-gray-700 font-medium">
										Testo della domanda: {mistake.questionText}
									</p>
									<p className="text-red-500">
										Correzione: {mistake.correction}
									</p>
								</div>
							))}
						</div>
					) : (
						<p className="text-green-500 font-bold">
							Complimenti! Hai risposto correttamente a tutte le domande!
						</p>
					)}
					<div className="absolute bottom-4 right-4 text-lg font-bold">
						Punteggio: {score}/{quizData?.questions.length}
					</div>
				</div>
			</div>
		);
	}

	return null;
};

export default TakeQuizSetup;
