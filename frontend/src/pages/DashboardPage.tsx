import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import QuizSetupStep from "../components/quizSetupStep";
import QuestionSelectionStep from "../components/QuizSelectionStep";

const Sidebar = ({ onSelect }: { onSelect: (section: string) => void }) => {
	return (
		<div className="w-64 bg-white p-6 shadow-md rounded">
			<h2 className="text-xl font-semibold mb-4">Menu</h2>
			<ul>
				<li
					className="cursor-pointer p-2 hover:bg-gray-200 rounded"
					onClick={() => onSelect("executedTests")}
					onKeyUp={(e) => e.key === "Enter" && onSelect("executedTests")}
				>
					Test Eseguiti
				</li>
				<li
					className="cursor-pointer p-2 hover:bg-gray-200 rounded"
					onClick={() => onSelect("testTemplates")}
					onKeyUp={(e) => e.key === "Enter" && onSelect("testTemplates")}
				>
					Gestione Modelli di Test
				</li>
			</ul>
		</div>
	);
};

const DashboardPage = () => {
	// Stati per le sezioni esistenti
	const [executedTests, setExecutedTests] = useState([
		{ id: 1, name: "Test Cognitivo", responses: ["Risposta 1", "Risposta 2"] },
		{ id: 2, name: "Test Fisico", responses: ["Risposta 3", "Risposta 4"] },
	]);

	const [testTemplates, setTestTemplates] = useState([
		{ id: 1, name: "Test Cognitivo", description: "", questions: [] },
		{ id: 2, name: "Test Fisico", description: "", questions: [] },
	]);

	// Stati per la logica di creazione dei quiz
	const [selectedSection, setSelectedSection] = useState("executedTests");
	const [newTemplate, setNewTemplate] = useState({
		id: uuidv4(),
		name: "",
		description: "",
		questions: [],
	});

	return (
		<div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-100 min-h-75">
			<Sidebar onSelect={setSelectedSection} />

			{/* Sezione "Test Eseguiti" */}
			{selectedSection === "executedTests" && (
				<div className="flex-1 bg-white p-6 shadow-md rounded">
					<h2 className="text-xl font-semibold mb-4">Test Eseguiti</h2>
					<ul>
						{executedTests.map((test) => (
							<li
								key={test.id}
								className="cursor-pointer p-2 hover:bg-gray-200 rounded"
							>
								{test.name}
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Sezione "Modelli di Test" */}
			{selectedSection === "testTemplates" && (
				<div className="flex-1 bg-white p-6 shadow-md rounded">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
							Gestione test
						</h2>
					</div>
					<div className="flex gap-2 mb-4 mt-4">
						<input
							type="text"
							placeholder="Cerca test..."
							className="flex-1 px-4 py-2 border rounded"
						/>
						<button
							type="button"
							className="bg-gray-200 text-gray-600 px-4 py-2 rounded flex items-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<title>search</title>
								<path
									fillRule="evenodd"
									d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387a1 1 0 01-1.414 1.414l-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z"
									clipRule="evenodd"
								/>
							</svg>
						</button>
						<button
							type="button"
							onClick={() => setSelectedSection("createTest")}
							className="bg-blue-500 text-white px-4 py-2 rounded"
						>
							Crea Nuovo Modello di Test
						</button>
					</div>
					<div className="container py-8">
						<h2 className="font-bold font-poppins text-2xl text-navbar-hover mb-4">
							Informazioni sul test
						</h2>
						<hr className="mb-4" />
						<ul>
							{testTemplates.map((template) => (
								<li
									key={template.id}
									className="flex justify-between items-center p-2 hover:bg-gray-200 rounded"
								>
									<span>{template.name}</span>
									<div className="flex gap-2">
										<button
											type="button"
											className="bg-yellow-500 text-white px-2 py-1 rounded"
										>
											Modifica
										</button>
										<button
											type="button"
											className="bg-red-500 text-white px-2 py-1 rounded"
										>
											Elimina
										</button>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
			{selectedSection === "createTest" && (
				<div className="flex-1 bg-white p-6 shadow-md rounded">
					<div className="w-full bg-navbar-hover px-4 py-4">
						<h2 className="text-white font-bold font-poppins m-0 text-left text-[42px]">
							CREAZIONE QUIZ
						</h2>
					</div>
					<QuestionSelectionStep quizData={newTemplate} />
				</div>
			)}
		</div>
	);
};

export default DashboardPage;
