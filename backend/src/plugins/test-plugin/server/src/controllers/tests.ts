import type { Context } from "koa";

type Quiz = {
	id: string;
	documentId: string;
	name: string;
	description: string;
	questions: {
		id: string;
		documentId: string;
		name: string;
		text: string;
		category: {
			id_category: string;
			documentId: string;
			name: string;
		};
		answers: {
			id: string;
			documentId: string;
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
	/**
	 * Funzione che permette di modificare un test.
	 * @param ctx
	 * @returns
	 */
	async submitModifyTest(ctx: Context) {
		const host = process.env.HOST;
		const port = process.env.PORT;
		const quiz = ctx.request.body as Quiz;
		console.log(quiz);

		const token = process.env.SERVICE_KEY;

		if (!token) {
			ctx.status = 401;
			ctx.body = { error: "Unauthorized" };
			return ctx;
		}

		// Modifico il test all'interno del database
		const testResponse = await fetch(
			`http://${host}:${port}/api/tests/${quiz.documentId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					data: {
						name_test: quiz.name,
						description_test: quiz.description,
					},
				}),
			},
		);

		// Se la risposta non è ok, setto l'errore nella risposta
		if (!testResponse.ok) {
			ctx.status = testResponse.status;
			ctx.body = { message: "Failed to create the test" };
			return ctx;
		}

		// Processo le domande del quiz
		for (const question of quiz.questions) {
			const idCategory = await getCategory(question.category.id_category);

			// Se la domanda non ha un documentId, allora vuol dire che la devo inserire
			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
			let questionResponse;
			if (question.documentId === "") {
				questionResponse = await fetch(`http://${host}:${port}/api/questions`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						data: {
							id_question: question.id,
							name: question.name,
							text: question.text,
							category_id: idCategory,
						},
					}),
				});
			} else {
				questionResponse = await fetch(
					`http://${host}:${port}/api/questions/${question.documentId}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							data: {
								name: question.name,
								text: question.text,
								category_id: idCategory,
							},
						}),
					},
				);
			}

			// Se la chiama API non è andata a buon fine, setto l'errore nella risposta
			if (!questionResponse.ok) {
				ctx.status = questionResponse.status;
				ctx.body = { message: "Errore nella creazione delle domande" };
				return ctx;
			}

			// La chiamata API ha avuto successo, estraggo l'id della domanda appena creata
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const questionData: any = await questionResponse.json();
			const questionId = questionData.data.documentId;
			console.log(questionData);

			// controllo se è stata aggiunta una domanda esistente che va quindi aggiunta question in test
			const exists = await fetch(
				`http://${host}:${port}/api/question-in-tests?filters[$and][0][question_id][documentId][$eq]=${question.documentId}&filters[$and][1][test_id][documentId][$eq]=${quiz.documentId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			console.log("\n\n", exists);

			if (exists.status === 200) {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				const existsData = (await exists.json()) as any;

				if (existsData.data.length === 0) {
					const questionInTestResponse = await fetch(
						`http://${host}:${port}/api/question-in-tests`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
							body: JSON.stringify({
								data: {
									question_id: questionId,
									test_id: quiz.documentId,
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
			}

			if (!exists.ok) {
				ctx.status = exists.status;
				ctx.body = { message: "Errore nella creazione delle domande" };
				return ctx;
			}

			// Processo le risposte collegate alla domanda corrente
			for (const answer of question.answers) {
				// Se la risposta non ha un documentId, allora vuol dire che la devo inserire
				// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
				let answerResponse;
				if (answer.documentId === "") {
					answerResponse = await fetch(`http://${host}:${port}/api/answers`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							data: {
								id_answer: answer.id,
								text: answer.text,
								correction: answer.correction,
								score: answer.score,
								question_id: questionId,
							},
						}),
					});
				} else {
					answerResponse = await fetch(
						`http://${host}:${port}/api/answers/${answer.documentId}`,
						{
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${token}`,
							},
							body: JSON.stringify({
								data: {
									text: answer.text,
									correction: answer.correction,
									score: answer.score,
								},
							}),
						},
					);
				}

				if (!answerResponse.ok) {
					ctx.status = answerResponse.status;
					ctx.body = { message: "Errore nella creazione delle risposte" };
					return ctx;
				}
			}
		}

		// Se tutto ha avuto successo, restituisco un messaggio di successo
		ctx.status = 200;
		ctx.body = { message: "Test created successfully" };
		return ctx;
	},

	/**
	 * Funzione che permette di eliminare un test.
	 * @param ctx
	 * @returns
	 */
	async deleteTest(ctx: Context) {
		const body = ctx.request.body;
		const quiz = body.quiz as Quiz;

		const token = process.env.SERVICE_KEY;

		if (!token) {
			ctx.status = 401;
			ctx.body = { error: "Unauthorized" };
			return ctx;
		}

		// Elimino le domande collegate al test
		for (const question of body.quiz.questions) {
			// Elimino le righe in question-in-tests
			const questionInTestResponse = await fetch(
				`http://localhost:1337/api/question-in-tests?filters[$and][0][question_id][documentId][$eq]=${question.documentId}&filters[$and][1][test_id][documentId][$eq]=${quiz.documentId}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!questionInTestResponse.ok) {
				ctx.status = questionInTestResponse.status;
				ctx.body = { message: "Non sono riuscito ad eliminare la riga." };
				return ctx;
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const questionInTestData = (await questionInTestResponse.json()) as any;
			for (const questionInTest of questionInTestData.data) {
				const questionInTestResponse = await fetch(
					`http://localhost:1337/api/question-in-tests/${questionInTest.documentId}`,
					{
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);

				if (!questionInTestResponse.ok) {
					ctx.status = questionInTestResponse.status;
					ctx.body = { message: "Non sono riuscito ad eliminare la riga." };
					return ctx;
				}
			}
		}

		// Elimino il test dalla tabella tests
		const testResponse = await fetch(
			`http://localhost:1337/api/tests/${quiz.documentId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!testResponse.ok) {
			ctx.status = testResponse.status;
			ctx.body = { message: "Non sono riuscito ad eliminare il test." };
			return ctx;
		}

		ctx.status = 200;
		ctx.body = { message: "Il test è stato eliminato correttamente." };
		return ctx;
	},

	/**
	 * Funzione che permette di ottenere un test completo.
	 * @param ctx
	 *
	 */
	async getCompleteTest(ctx: Context) {
		const host = process.env.HOST;
		const port = process.env.PORT;
		const body = ctx.request.body;

		const token = process.env.SERVICE_KEY;

		if (!token) {
			ctx.status = 401;
			ctx.body = { error: "Unauthorized" };
			return ctx;
		}

		const returnData: Quiz = {
			id: "",
			name: "",
			documentId: "",
			description: "",
			questions: [],
		};

		// Recupero il test
		const testResponse = await fetch(
			`http://${host}:${port}/api/tests?filters[documentId][$eq]=${body.testDocId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!testResponse.ok) {
			ctx.status = testResponse.status;
			ctx.body = { message: "Failed to retrieve test" };
			return ctx;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const testData = (await testResponse.json()) as any;
		returnData.id = testData.data[0].id_test;
		returnData.documentId = testData.data[0].documentId;
		returnData.name = testData.data[0].name_test;
		returnData.description = testData.data[0].description_test;

		// Recupero le domande legate a questo test
		const questionInTestResponse = await fetch(
			`http://${host}:${port}/api/question-in-tests?filters[test_id][$eq]=${testData.data[0].id}&pLevel`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!questionInTestResponse.ok) {
			ctx.status = questionInTestResponse.status;
			ctx.body = { message: "Failed to retrieve questions" };
			return ctx;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const questionInTestData = (await questionInTestResponse.json()) as any;
		for (const questionInTest of questionInTestData.data) {
			const question = questionInTest.question_id;
			const questionId = question.id;

			// Recupero le risposte legate a questa domanda
			const answerResponse = await fetch(
				`http://${host}:${port}/api/answers?filters[question_id][$eq]=${questionId}&pLevel`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!answerResponse.ok) {
				ctx.status = answerResponse.status;
				ctx.body = { message: "Failed to retrieve answers" };
				return ctx;
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const answerData = (await answerResponse.json()) as any;

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const answers = answerData.data.map((answer: any) => ({
				id: answer.id_answer,
				documentId: answer.documentId,
				text: answer.text,
				correction: answer.correction,
				score: answer.score,
			}));

			// inserisco i dati
			returnData.questions.push({
				id: question.id_question,
				documentId: question.documentId,
				name: question.name,
				text: question.text,
				category: {
					id_category: question.category_id
						? question.category_id.id_category
						: "",
					documentId: question.category_id
						? question.category_id.documentId
						: "",
					name: question.category_id ? question.category_id.name : "",
				},
				answers: answers,
			});
		}

		ctx.status = 200;
		ctx.body = returnData;
		return ctx;
	},

	/**
	 * Funzione che permette di inserire un test nel database.
	 * @param ctx
	 * @returns
	 */
	async createTest(ctx: Context) {
		const quiz = ctx.request.body as Quiz;
		const token = process.env.SERVICE_KEY;

		if (!token) {
			ctx.status = 401;
			ctx.body = { error: "Unauthorized" };
			return ctx;
		}

		// Inserisco il test all'interno del database
		const testResponse = await fetch("http://localhost:1337/api/tests", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
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
			// Se la domanda ha un documentId la inserisco subito nella tabella question-in-tests
			const questionInTestResponse = await fetch(
				"http://localhost:1337/api/question-in-tests",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						data: {
							question_id: question.documentId,
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
		const token = process.env.SERVICE_KEY;

		if (!token) {
			throw new Error("Unauthorized");
		}

		const response = await fetch(
			"http://localhost:1337/api/test-plugin/get-categories",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
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
