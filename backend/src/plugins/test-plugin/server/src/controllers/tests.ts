import type { Context } from "koa";
import testsService from "../services/tests";
import axios from "axios";

type Quiz = {
	id: string;
	name: string;
	description: string;
	questions: {
		id: string;
		name: string;
		text: string;
		category: {
			id_category: string;
			name: string;
		};
		answers: {
			id: string;
			text: string;
			correction: string;
			score: number;
		}[];
	}[];
};

type TestResponse = {
	data: {
		id: number;
		documentId: string;
		id_test: string;
		name_test: string;
		description_test: string;
		created_at: string;
		updated_at: string;
		published_at: string;
	};
};

export default {
	async testManagement(ctx: Context) {
		try {
			const getTestHTML = await testsService.getTestHTML();
			ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Test Management</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 font-sans">
                        <div class="max-w-3xl mx-auto p-8">
                            <h1 class="text-3xl font-semibold text-gray-800 mb-6">Gestione Tests</h1>
                            <h2 class="text-xl font-medium text-gray-700 mb-4">Tests</h2>
                            <ul class="list-disc pl-8 mb-4">${getTestHTML}</ul>
                            <form method="POST" action="http://localhost:1337/api/test-plugin/create-test" enctype="application/json" class="bg-white p-6 rounded-lg shadow-lg">
        	    				<label for="name_test" class="block text-lg text-gray-800 mb-2">Name:</label>
        	    				<input type="text" name="name_test" id="name_test" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
        	    				<label for="description_test" class="block text-lg text-gray-800 mb-2">Descrizione:</label>
            	    			<textarea name="description_test" id="description_test" class="border border-gray-300 p-2 rounded-lg w-full mb-4"></textarea>
                                <button type="submit" class="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">Crea Test</button>
        	    			</form>
                            <a href="http://localhost:1337/api/test-plugin/search-test-Execution" class="text-blue-500 hover:underline mt-4 inline-block">Torna alla pagina principale</a>
                        </div>
                    </body>
                </html>`;
			ctx.type = "html";
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	async modifyTest(ctx: Context) {
		try {
			const { documentId } = ctx.query;
			const response = await axios.get(
				`http://localhost:1337/api/tests/${documentId}?pLevel=3`,
			);
			const data = response.data.data;

			// Filtro i dati
			const filteredData = {
				id: data.id ? data.id : null,
				documentId: data.documentId,
				id_test: data.id_test,
				name_test: data.name_test,
				description_test: data.description_test,
				question_in_tests: data.question_in_tests
					? data.question_in_tests.map((question_in_tests) => ({
							id: question_in_tests.id ? question_in_tests.id : null,
							documentId: question_in_tests.documentId,
							id_question: question_in_tests.id_question
								? {
										id: question_in_tests.id_question.id
											? question_in_tests.id_question.id
											: null,
										documentId: question_in_tests.id_question.documentId,
										id_question: question_in_tests.id_question.id_question,
										name: question_in_tests.id_question.name,
										text: question_in_tests.id_question.text,
									}
								: [],
						}))
					: [],
			};

			ctx.body = `
            <html>
                <head>
                    <title>Modifica Test</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 font-sans">
                    <div class="max-w-3xl mx-auto p-8">
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Modifica Test</h1>
                        <form action="http://localhost:1337/api/test-plugin/submit-modify-test/?documentId=${documentId}" method="POST" class="bg-white p-6 rounded-lg shadow-lg">
                            <label for="name_test" class="block text-lg text-gray-800 mb-2">Name:</label>
                            <input type="text" name="name_test" id="name_test" value="${data.name_test || ""}" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
    
                            <label for="description_test" class="block text-lg text-gray-800 mb-2">Descrizione:</label>
                            <textarea name="description_test" id="description_test" required class="border border-gray-300 p-2 rounded-lg w-full mb-4">${data.description_test || ""}</textarea>
    
                            <button type="submit" class="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">Modifica Test</button>
                            <a href="http://localhost:1337/api/test-plugin/display-test" class="text-blue-500 hover:underline mt-4 inline-block">Torna alla visualizzazione dei Test</a>
                        </form>
                    </div>
                </body>
            </html>`;
			ctx.type = "html";
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	async submitModifyTest(ctx: Context) {
		try {
			const { documentId } = ctx.query;
			const { name_test, description_test } = ctx.request.body;
			console.log(ctx.request.body);

			// Struttura il payload correttamente
			const payload = {
				data: {
					name_test,
					description_test,
				},
			};

			// Modifica il Test con i dati forniti
			await axios.put(`http://localhost:1337/api/tests/${documentId}`, payload);

			// Pagina di conferma
			ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-test">
                        <title>Redirect</title>					
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                        <div class="bg-white p-8 rounded-lg shadow-lg text-center">
                            <h1 class="text-2xl font-semibold text-green-600 mb-4">Test modificato con successo</h1>
                            <p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
                        </div>
                    </body>
                </html>`;
			ctx.type = "html";
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	async deleteTest(ctx: Context) {
		try {
			const { documentId } = ctx.query;

			// Elimina il Test con l'id fornito
			await axios.delete(`http://localhost:1337/api/tests/${documentId}`);

			// Pagina di conferma
			ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-test">
                        <title>Redirect</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                        <div class="bg-white p-8 rounded-lg shadow-lg text-center">
                            <h1 class="text-2xl font-semibold text-red-600 mb-4">Test eliminato con successo</h1>
                            <p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
                        </div>
                    </body>
                </html>`;
			ctx.type = "html";
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	async getTests() {
		try {
			const tests = await axios.get("http://localhost:1337/api/tests?pLevel=3");
			const filteredTests = tests.data.data.map((data) => ({
				id: data.id ? data.id : null,
				documentId: data.documentId,
				id_test: data.id_test,
				name_test: data.name_test,
				description_test: data.description_test,
				question_in_tests: data.question_in_tests
					? data.question_in_tests.map((question_in_tests) => ({
							id: question_in_tests.id ? question_in_tests.id : null,
							documentId: question_in_tests.documentId,
							id_question: question_in_tests.id_question
								? {
										id: question_in_tests.id_question.id
											? question_in_tests.id_question.id
											: null,
										documentId: question_in_tests.id_question.documentId,
										id_question: question_in_tests.id_question.id_question,
										name: question_in_tests.id_question.name,
										text: question_in_tests.id_question.text,
									}
								: [],
						}))
					: [],
			}));

			console.log(filteredTests);
			return filteredTests;
		} catch (error) {
			return `<li>Errore nel caricamento delle categories: ${error.message}</li>`;
		}
	},

	/**
	 * Funzione che permtedde di inserire un test nel database.
	 * @param ctx
	 * @returns
	 */
	async createTest(ctx: Context) {
		const quiz = ctx.request.body as Quiz;

		// Inserisco il test all'interno del database
		const testResponse = await fetch("http://localhost:1337/api/tests", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				data: {
					id_test: quiz.id,
					name_test: quiz.name,
					description_test: quiz.description,
				},
			}),
		});

		// Se la risposta non è ok, setto l'errore nella risposta
		if (!testResponse.ok) {
			ctx.status = testResponse.status;
			ctx.body = { message: "Failed to create the test" };
			return ctx;
		}

		// La chiamata API ha avuto successo, estraggo l'id del test appena creato
		// che servirà per le relazioni
		const testData = (await testResponse.json()) as TestResponse;
		const testId = testData.data.documentId;

		// Processo le domande del quiz
		for (const question of quiz.questions) {
			// recupero l'id della categoria creata
			const categoryId = await getCategory(question.category.id_category);

			if (categoryId === undefined) {
				ctx.status = 404;
				ctx.body = { message: "Categoria non trovata" };
				return ctx;
			}

			// Inserisco la domanda corrente
			const questionResponse = await fetch(
				"http://localhost:1337/api/test-plugin/create-question",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						id_question: question.id,
						name: question.name,
						text: question.text,
						category_id: categoryId,
					}),
				},
			);

			// Se la chiama API non è andata a buon fine, setto l'errore nella risposta
			if (!questionResponse.ok) {
				ctx.status = questionResponse.status;
				ctx.body = { message: "Errore nella creazione delle domande" };
				return ctx;
			}

			// La chiamata API ha avuto successo, estraggo l'id della domanda appena creata
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const questionData: any = await questionResponse.json();
			const questionId = questionData.question_id;

			// Processo le risposte collegate alla domanda corrente
			for (const answer of question.answers) {
				const answerResponse = await fetch(
					"http://localhost:1337/api/test-plugin/create-answer",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							id_answer: answer.id,
							text: answer.text,
							correction: answer.correction,
							score: answer.score,
							question_id: questionId,
						}),
					},
				);

				if (!answerResponse.ok) {
					ctx.status = answerResponse.status;
					ctx.body = { message: "Errore nella creazione delle risposte" };
					return ctx;
				}
			}

			// Collego le domande al test
			const questionInTestResponse = await fetch(
				"http://localhost:1337/api/question-in-tests",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						data: {
							question_id: questionId,
							test_id: testId,
						},
					}),
				},
			);

			if (!questionInTestResponse.ok) {
				ctx.status = questionInTestResponse.status;
				ctx.body = { message: "Errore nella creazione delle domande" };
				return ctx;
			}
		}

		// Se tutto ha avuto successo, restituisco un messaggio di successo
		ctx.status = 200;
		ctx.body = { message: "Test created successfully" };
		return ctx;
	},
};

async function getCategory(category_id: string) {
	try {
		const response = await fetch(
			"http://localhost:1337/api/test-plugin/get-categories",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const data = (await response.json()) as {
			documentId: string;
			id_category: string;
			name: string;
		}[];

		if (data.length === 0) {
			return undefined;
		}

		const existingCategory = data.find(
			(category) => category.id_category === category_id,
		);

		if (existingCategory) {
			return existingCategory.documentId;
		}

		return undefined;
	} catch (error) {
		throw new Error("Errore durante il recupero delle categorie");
	}
}
