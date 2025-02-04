import type { Context } from "koa";
import axios from "axios";

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

		// Inserisco il test all'interno del database
		const testResponse = await fetch(
			`http://${host}:${port}/api/tests/${quiz.documentId}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
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
			const categoryResp = await fetch(
				`http://${host}:${port}/api/categories/${question.category.documentId}`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
				},
			);

			if (!categoryResp.ok) {
				ctx.status = categoryResp.status;
				ctx.body = { message: "Failed to retrieve category" };
				return ctx;
			}
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const catContent = (await categoryResp.json()) as any;
			const idStrapi = catContent.data.id;

			const questionResponse = await fetch(
				`http://${host}:${port}/api/questions/${question.documentId}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						data: {
							name: question.name,
							text: question.text,
							category_id: idStrapi,
						},
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
					`http://${host}:${port}/api/answers/${answer.documentId}`,
					{
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							data: {
								text: answer.text,
								correction: answer.correction,
								score: answer.score,
							},
						}),
					},
				);

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

		// Elimino il test dalla tabella tests
		const testResponse = await fetch(
			`http://localhost:1337/api/tests/${quiz.documentId}`,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
			},
		);

		if (!testResponse.ok) {
			ctx.status = testResponse.status;
			ctx.body = { message: "Non sono riuscito ad eliminare il test." };
			return ctx;
		}

		// Elimino le domande collegate al test
		for (const question of body.quiz.questions) {
			const questionResponse = await fetch(
				`http://localhost:1337/api/questions/${question.documentId}`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
				},
			);

			if (!questionResponse.ok) {
				ctx.status = questionResponse.status;
				ctx.body = { message: "Non sono riuscito ad eliminare la domanda." };
				return ctx;
			}

			// Elimino le risposte collegate alla domanda
			for (const answer of question.answers) {
				const answerResponse = await fetch(
					`http://localhost:1337/api/answers/${answer.documentId}`,
					{
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
					},
				);

				if (!answerResponse.ok) {
					ctx.status = answerResponse.status;
					ctx.body = { message: "Non sono riuscito ad eliminare la risposta." };
					return ctx;
				}
			}

			// Elimino le righe in question-in-tests
			const questionInTestResponse = await fetch(
				`http://localhost:1337/api/question-in-tests?filters[question_id][$eq]=${question.id}`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
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
						headers: { "Content-Type": "application/json" },
					},
				);

				if (!questionInTestResponse.ok) {
					ctx.status = questionInTestResponse.status;
					ctx.body = { message: "Non sono riuscito ad eliminare la riga." };
					return ctx;
				}
			}
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
				headers: { "Content-Type": "application/json" },
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
				headers: { "Content-Type": "application/json" },
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
					headers: { "Content-Type": "application/json" },
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
					id_category: question.category_id.id_category,
					documentId: question.category_id.documentId,
					name: question.category_id.name,
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

		console.log(testResponse.ok);

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
