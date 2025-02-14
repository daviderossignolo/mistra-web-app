import type React from "react";
import { useEffect, useState } from "react";
import type { Category } from "../components/QuestionModal";

// Definizione dei tipi per i dati che arrivano dal backend
type Sex = {
	id: number;
	documentId: string;
	name: string;
	sex_id: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
};

type Answer = {
	id: string;
	documentId: string;
	text: string;
	correction: string;
	score: number;
};

type Question = {
	id: string;
	documentId: string;
	name: string;
	text: string;
	category: Category;
	answers: Answer[];
};

type QuizData = {
	id: string;
	documentId: string;
	name: string;
	description: string;
	questions: Question[];
};

const TakeQuizPage: React.FC = () => {
	// Variabile di stato usata per gestire gli step del quiz
	const [step, setStep] = useState(0);

	// Variabili di stato per gestire i dati utente
	const [userData, setUserData] = useState({ sex: "", age: "" });

	// Variabili di stato per gestire il test
	const [testCode, setTestCode] = useState("");
	const [selectedAnswers, setSelectedAnswers] = useState<{
		[key: string]: string;
	}>({});
	const [score, setScore] = useState(0);

	// Variabili che contengono i dati arrivati dal backend
	const [quizData, setQuizData] = useState<QuizData>();
	const [sexData, setSexData] = useState<Sex[]>([]);

	// Chiavi per le variabili d'ambiente
	const host = process.env.REACT_APP_BACKEND_HOST;
	const port = process.env.REACT_APP_BACKEND_PORT;

	// Funzione che permette di gestire il submit dei dati utente
	const handleUserDataSubmit = () => {
		const age = Number.parseInt(userData.age, 10);

		// Se i dati sono validi procedo con il prossimo step
		if (userData.sex && age >= 16 && age <= 100) {
			setStep(1);
		} else {
			if (!userData.sex) {
				alert("Per continuare inserisci il sesso.");
			} else if (age < 16 || age > 100) {
				alert("Per continuare inserisci un'età compresa tra 16 e 100 anni.");
			} else {
				alert("Per continuare inserisci sesso ed età.");
			}
		}
	};

	// Recupero dei dati dal backend
	useEffect(() => {
		// Funzione per recuperare un test casuale dal database
		const fetchRandomTest = async () => {
			try {
				const token = localStorage.getItem("token");

				const randomTestResponse = await fetch(
					`${host}:${port}/api/test-plugin/random-test`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);

				if (randomTestResponse.ok) {
					const randomTest = await randomTestResponse.json();
					setQuizData(randomTest);
					createQuizId();
				} else {
					throw new Error("Errore nel recupero del test.");
				}
			} catch (error) {
				console.error("Errore durante il recupero del test:", error);
			}
		};

		// Funzione per recuperare i dati sul sesso
		const fetchSexData = async () => {
			try {
				const response = await fetch(`${host}:${port}/api/sexes`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Errore nel recupero dei dati sul sesso.");
				}

				const data = await response.json();
				setSexData(data.data);
			} catch (error) {}
		};

		fetchSexData();
		fetchRandomTest();
	}, [host, port]);

	// Funzione per gestire la selezione delle risposte
	const handleAnswerSelect = (questionId: string, answerId: string) => {
		setSelectedAnswers((prev) => ({
			...prev,
			[questionId]: answerId,
		}));
	};

	// Funzione di help che crea il codice del test
	const createQuizId = () => {
		const date = new Date();
		const isoDate = date.toISOString();
		const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		const randomLetters = Array.from(
			{ length: 3 },
			() => letters[Math.floor(Math.random() * letters.length)],
		).join("");

		setTestCode(`${isoDate}-${randomLetters}`);
	};

	// Funzione di help per ottenere l'indirizzo IP dell'utente
	const getIP = async () => {
		const ip = await fetch("https://api.ipify.org?format=json")
			.then((res) => res.json())
			.then((data) => data.ip);

		return ip;
	};

	// Funzione che gestisce la logica di submit del quiz
	const handleQuizSubmit = async () => {
		// Se non ci sono dati sul quiz non proseguo
		if (!quizData) return;

		let totalScore = 0;
		for (const question of quizData.questions) {
			const selectedAnswerId = selectedAnswers[question.documentId];
			const selectedAnswer = question.answers.find(
				(a) => a.documentId === selectedAnswerId,
			);

			if (selectedAnswer) {
				totalScore += selectedAnswer.score;
			}
		}

		// salvo il test nel database
		// inserisco il quiz all'interno del database
		const compiledQuiz = {
			id: testCode,
			execution_time: new Date().toISOString(),
			age: Number.parseInt(userData.age),
			id_sex: sexData.filter((sex) => sex.name === userData.sex)[0].documentId,
			id_test: quizData.documentId,
			score: totalScore,
			ip: await getIP(),
			answers: Object.values(selectedAnswers),
		};

		// chiamata al backend per salvare il test
		const response = await fetch(
			`${host}:${port}/api/test-plugin/insert-test-execution`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					//"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify(compiledQuiz),
			},
		);

		if (!response.ok) {
			alert("Errore durante il salvataggio del test.");
		}

		// Set final score and mistakes
		setScore(totalScore);
		setStep(2);
	};

	// Primo step: inserimento dei dati su sesso ed età da parte dell'utente
	if (step === 0) {
		return (
			<div className="flex justify-center items-center bg-gray-100 py-8 font-accesible-font text-navbar-hover">
				<div className="flex flex-col items-center bg-white shadow-md rounded-lg p-4 w-4/5">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-accesible-font m-0 text-left text-[2.625rem]">
							Inserisci i tuoi dati
						</h2>
					</div>
					<form
						className="w-full max-w-md"
						onSubmit={(e) => {
							e.preventDefault();
							handleUserDataSubmit();
						}}
						aria-label="Inserimento dati personali"
					>
						<div className="mb-8 mt-8">
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
								aria-required="true" // Indica che il campo è obbligatorio
								tabIndex={0}
							>
								<option value="" disabled tabIndex={0}>
									Seleziona...
								</option>
								{sexData?.map((sex: Sex) => (
									<option key={sex.id} value={sex.name} tabIndex={0}>
										{sex.name}
									</option>
								))}
							</select>
						</div>
						<div className="mb-8">
							<label htmlFor="age" className="block text-sm font-bold mb-2">
								Età
							</label>
							<input
								type="number"
								id="age"
								value={userData.age}
								onChange={(e) =>
									setUserData({ ...userData, age: e.target.value })
								}
								className="border rounded w-full py-2 px-3"
								placeholder="Inserisci la tua età..."
								aria-required="true" // Indica che il campo è obbligatorio
							/>
						</div>
						<button
							type="submit"
							className="bg-navbar-hover text-white font-bold py-2 px-4 rounded"
						>
							Procedi con il test
						</button>
					</form>
				</div>
			</div>
		);
	}

	if (step === 1) {
		// Quiz Step
		return (
			<div className="flex justify-center items-center bg-gray-100 py-8 font-accesible-font text-navbar-hover">
				<div
					className="flex flex-col bg-white shadow-md rounded-lg p-4 w-4/5"
					aria-labelledby="quizHeading"
				>
					{quizData && (
						<>
							<div className="w-full bg-navbar-hover px-4 py-4">
								<h1
									id="quizHeading"
									className="text-white font-bold font-accesible-font m-0 text-left text-[2.625rem]"
								>
									Rispondi alle domande
								</h1>
							</div>
							<div
								className="flex flex-col mt-4 mb-4 p-4 border-2 border-red-600 rounded-lg bg-red-50"
								role="alert"
								aria-live="assertive"
							>
								<h3 className="text-xl font-bold text-red-600 mb-2">
									IMPORTANTE!
								</h3>
								<p className="text-lg text-navbar-hover">
									Di seguito troverai il codice univoco del tuo quiz, salvalo da
									qualche parte, dovrai comunicarlo al medico al momento della
									visita.
								</p>
								<p className="text-lg font-bold text-navbar-hover mt-2">
									CODICE: {testCode}
								</p>
							</div>

							{/* Sezione informazioni */}
							<div className="mt-2 py-4 rounded-lg mb-6 bg-gray-50 p-4 shadow-sm">
								<h3 className="text-xl font-bold mb-2 text-navbar-hover">
									Informazioni sul test
								</h3>
								<hr className="mb-4" />
								<div className="flex items-center mb-2">
									<h4 className="text-lg font-semibold mr-2 text-navbar-hover">
										Nome del Test:
									</h4>
									<p className="text-lg text-navbar-hover">{quizData.name}</p>
								</div>
								<h4 className="text-lg font-semibold mb-2 text-navbar-hover">
									Descrizione:
								</h4>
								<p className="text-navbar-hover text-left">
									{quizData.description}
								</p>
							</div>
						</>
					)}

					{/* Sezione domande del test */}
					{quizData?.questions.map((question, index) => (
						<section
							key={question.id}
							aria-labelledby={`questionHeading-${question.id}`}
							className="mt-2 py-4 rounded-lg mb-6 bg-gray-50 p-4 shadow-sm"
						>
							<h3
								id={`questionHeading-${question.id}`}
								className="text-xl font-bold mb-2 text-navbar-hover"
							>
								Domande
							</h3>
							<hr className="mb-4" />
							<div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50 font-accesible-font">
								<p className="text-sm text-gray-600 mb-2">
									Categoria: {question.category.name}
								</p>
								<h4 className="text-lg font-medium mb-2">
									{index + 1}. {question.name}: {question.text}
								</h4>
								<div className="flex flex-col space-y-2">
									{question.answers.map((answer) => (
										<label
											key={answer.documentId}
											className="flex items-center space-x-2"
										>
											<input
												type="radio"
												id={`answer-${answer.documentId}`}
												name={`question-${question.documentId}`}
												value={answer.id}
												checked={
													selectedAnswers[question.documentId] ===
													answer.documentId
												}
												onChange={() =>
													handleAnswerSelect(
														question.documentId,
														answer.documentId,
													)
												}
												className="form-radio text-navbar"
												aria-label={answer.text} // Descrive l'opzione per gli screen reader
											/>
											<span className="text-navbar-hover">{answer.text}</span>
										</label>
									))}
								</div>
							</div>
						</section>
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
			<div className="flex justify-center items-center bg-gray-100 py-8 font-accesible-font text-navbar-hover">
				<div
					className="flex flex-col bg-white shadow-md rounded-lg p-4 w-4/5"
					aria-labelledby="resultsHeading"
				>
					{quizData && (
						<>
							<div className="w-full bg-navbar-hover px-4 py-4">
								<h1
									id="resultsHeading"
									className="text-white font-bold font-accesible-font m-0 text-left text-[2.625rem]"
								>
									Risultati del Test
								</h1>
							</div>

							<div
								className="flex flex-col mt-4 mb-4 p-4 border-2 border-red-600 rounded-lg bg-red-50"
								role="alert"
								aria-live="assertive"
							>
								<h3 className="text-xl font-bold text-red-600 mb-2">
									IMPORTANTE!
								</h3>
								<p className="text-lg text-navbar-hover">
									Di seguito troverai il codice univoco del tuo quiz, salvalo da
									qualche parte, dovrai comunicarlo al medico al momento della
									visita.
								</p>
								<p className="text-lg font-bold text-navbar-hover mt-2">
									CODICE: {testCode}
								</p>
							</div>

							{/* Sezione informazioni */}
							<div className="mt-2 py-4 rounded-lg mb-6 bg-gray-50 p-4 shadow-sm">
								<h3 className="text-xl font-bold mb-2 text-navbar-hover">
									Informazioni sul test
								</h3>
								<hr className="mb-4" />
								<div className="flex items-center mb-2">
									<h4 className="text-lg font-semibold mr-2 text-navbar-hover">
										Nome del Test:
									</h4>
									<p className="text-lg text-navbar-hover">{quizData.name}</p>
								</div>
								<h4 className="text-lg font-semibold mb-2 text-navbar-hover">
									Descrizione:
								</h4>
								<p className="text-navbar-hover text-left">
									{quizData.description}
								</p>
							</div>
						</>
					)}

					{/* Sezione domande del test */}
					{quizData?.questions.map((question, index) => {
						const selectedAnswerId = selectedAnswers[question.documentId];
						const selectedAnswer = question.answers.find(
							(a) => a.documentId === selectedAnswerId,
						);
						const isCorrect = selectedAnswer?.score === 1;

						return (
							<section
								key={question.id}
								aria-labelledby={`questionResultHeading-${question.id}`}
								className="mt-2 py-4 rounded-lg mb-6 bg-gray-50 p-4 shadow-sm"
							>
								<h3
									id={`questionResultHeading-${question.id}`}
									className="text-xl font-bold mb-2 text-navbar-hover"
								>
									Domande
								</h3>
								<hr className="mb-4" />
								<div className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50 font-accesible-font">
									<p className="text-sm text-gray-600 mb-2">
										Categoria: {question.category.name}
									</p>
									<h4 className="text-lg font-medium mb-2">
										{index + 1}. {question.name}: {question.text}
									</h4>
									<div className="flex flex-col space-y-2">
										{question.answers.map((answer) => (
											<label
												key={answer.documentId}
												className="flex items-center space-x-2"
											>
												<input
													type="radio"
													id={`answer-${answer.documentId}`}
													name={`question-${question.documentId}`}
													value={answer.documentId}
													checked={
														selectedAnswers[question.documentId] ===
														answer.documentId
													}
													disabled
													className="form-radio text-navbar"
													aria-label={answer.text}
												/>
												<span className="text-navbar-hover">{answer.text}</span>
											</label>
										))}
									</div>
									{!isCorrect && selectedAnswer && (
										<p className="text-red-700 mt-2" role="alert">
											Correzione: {selectedAnswer.correction}
										</p>
									)}
								</div>
							</section>
						);
					})}

					<div className="mt-6 flex justify-end items-center space-x-4">
						<div className="text-lg font-bold">
							Punteggio: {score}/{quizData?.questions.length}
						</div>
						<button
							type="button"
							onClick={window.print}
							className="bg-navbar-hover text-white font-bold py-2 px-4 rounded"
							aria-label="Stampa i risultati del test"
						>
							Scarica PDF
						</button>
					</div>
				</div>
			</div>
		);
	}

	return null;
};

export default TakeQuizPage;
