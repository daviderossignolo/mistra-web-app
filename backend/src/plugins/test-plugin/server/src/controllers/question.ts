import type { Context } from "koa";

export default {
	/**
	 * Endpoint per la creazione di una domanda.
	 * @param ctx
	 * @returns
	 */
	async createQuestion(ctx: Context) {
		const token = process.env.SERVICE_KEY;
		const body = ctx.request.body;
		console.log("BODY: ", body);

		const id_question = body.id;
		const name = body.name;
		const text = body.text;
		const category_id = body.category_id;
		const answers = body.answers;

		if (!token) {
			ctx.status = 401;
			ctx.body = { error: "Unauthorized" };
			return ctx;
		}

		// Faccio la chiamata API a Strapi per creare la Question
		const response = await fetch("http://localhost:1337/api/questions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				data: {
					id_question: id_question,
					name: name,
					text: text,
					category_id: category_id,
				},
			}),
		});

		if (!response.ok) {
			ctx.status = response.status;
			ctx.body = { error: "Errore nella creazione della domanda" };
			return ctx;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const questionData: any = await response.json();
		const documentId = questionData.data.documentId;

		// Creo le risposte collegate alla domanda
		for (const answer of answers) {
			const answerResponse = await fetch("http://localhost:1337/api/answers", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					data: {
						text: answer.text,
						correction: answer.correction,
						score: answer.score,
						question_id: documentId,
					},
				}),
			});

			if (!answerResponse.ok) {
				ctx.status = answerResponse.status;
				ctx.body = { error: "Errore nella creazione delle risposte" };
				return ctx;
			}
		}

		ctx.status = 200;
		ctx.body = { documentId: documentId };

		return ctx;
	},

	/**
	 * Endpoint per la visualizzazione di una domanda.
	 * @param ctx
	 * @returns filtredData
	 */
	async modifyQuestion(ctx: Context) {
		const token = process.env.SERVICE_KEY;
		const body = ctx.request.body;
		const questionDocumentId = body.documentId;
		const name = body.name;
		const text = body.text;
		const category_id = body.category_id;
		const answers = body.answers;

		// Eseguo la chiamata PUT della domanda
		const response = await fetch(
			`http://localhost:1337/api/questions/${questionDocumentId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					data: {
						name: name,
						text: text,
						category_id: category_id,
					},
				}),
			},
		);

		if (!response.ok) {
			ctx.status = response.status;
			ctx.body = { error: "Errore nella modifica della domanda" };
			return ctx;
		}

		// Devo modificare le risposte
		for (const answer of answers) {
			// se ha aggiunto una domanda la devo aggiungere
			if (answer.documentId === "") {
				const answerResponse = await fetch(
					"http://localhost:1337/api/answers",
					{
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
								question_id: questionDocumentId,
							},
						}),
					},
				);

				if (!answerResponse.ok) {
					ctx.status = answerResponse.status;
					ctx.body = { error: "Errore nella modifica delle risposte" };
					return ctx;
				}
			} else {
				const answerResponse = await fetch(
					`http://localhost:1337/api/answers/${answer.documentId}`,
					{
						method: "PUT",
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
							},
						}),
					},
				);

				if (!answerResponse.ok) {
					ctx.status = answerResponse.status;
					ctx.body = { error: "Errore nella modifica delle risposte" };
					return ctx;
				}
			}
		}

		ctx.status = 200;
		ctx.body = {};
	},

	/**
	 * Permette di eliminare una domanda presente in un test.
	 * (Non elimina la domanda dal database, ma solo la relazione con il test)
	 * @param ctx
	 * @returns
	 */
	async deleteQuestionInTest(ctx: Context) {
		const body = ctx.request.body;
		const documentId = body.documentId;

		const host = process.env.HOST;
		const port = process.env.PORT;

		const token = process.env.SERVICE_KEY;

		if (!token) {
			ctx.status = 401;
			ctx.body = { error: "Non autorizzato" };
			return ctx;
		}

		// Devo recupera il document id della riga di question in test, se faccio la delete specificando solo il documentId della relazione question
		// viene eliminata solo la relazione e non tutta la riga
		const testResponse = await fetch(
			`http://${host}:${port}/api/question-in-tests?filters[question_id][documentId][$eq]=${documentId}&pLevel`,
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
			ctx.body = { error: "Errore nell'eliminazione della domanda" };
			return ctx;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const testResponseData = (await testResponse.json()) as any;
		console.log(testResponseData);
		const questionIntest = testResponseData.data[0].documentId;

		// Elimino la riga da question-in-tests
		const deleteResponse = await fetch(
			`http://localhost:1337/api/question-in-tests/${questionIntest}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!deleteResponse.ok) {
			ctx.status = deleteResponse.status;
			ctx.body = { error: "Errore nell'eliminazione della domanda" };
			return ctx;
		}

		ctx.status = 200;
		ctx.body = { message: "Question deleted successfully" };
		return ctx;
	},

	/**
	 * Endpoint per ottenere le domande.
	 * @param ctx
	 * @returns
	 */
	async getQuestions(ctx) {
		try {
			const token = process.env.SERVICE_KEY;
			const response = await fetch(
				"http://localhost:1337/api/questions?pLevel",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Errore nel caricamento delle domande" };
				return ctx;
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const responseData: any = await response.json();

			const data = responseData.data;

			const filteredAnswers = responseData.data.map((data) => ({
				id: data.id_question,
				documentId: data.documentId,
				name: data.name,
				text: data.text,
				category: data.category_id
					? {
							documentId: data.category_id.documentId,
							id_category: data.category_id.id_category,
							name: data.category_id.name,
						}
					: null,
			}));

			return filteredAnswers;
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	/**
	 * Endopoint che elimina una domanda in modo definitivo dal database.
	 * @param ctx
	 * @returns
	 */
	async deleteQuestionModel(ctx: Context) {
		const body = ctx.request.body;
		const question_id = body.question_id;
		console.log("QUESTION ID: ", question_id);
		const token = process.env.SERVICE_KEY;

		// Elimino prima tutte le risposte legate alla domanda
		const response = await fetch(
			`http://localhost:1337/api/answers?filters[question_id][documentId][$eq]=${question_id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!response.ok) {
			ctx.status = response.status;
			ctx.body = { error: "Errore nella cancellazione delle risposte" };
			return ctx;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const responseData: any = await response.json();
		const answers = responseData.data;

		for (const answer of answers) {
			const deleteResponse = await fetch(
				`http://localhost:1337/api/answers/${answer.documentId}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!deleteResponse.ok) {
				ctx.status = deleteResponse.status;
				ctx.body = { error: "Errore nella cancellazione delle risposte" };
				return ctx;
			}
		}

		// Elimino la domanda
		const deleteQuestionResponse = await fetch(
			`http://localhost:1337/api/questions/${question_id}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!deleteQuestionResponse.ok) {
			ctx.status = deleteQuestionResponse.status;
			ctx.body = { error: "Errore nella cancellazione della domanda" };
			return ctx;
		}

		ctx.status = 200;
		ctx.body = { message: "Question deleted successfully" };
		return ctx;
	},

	/**
	 * Endpoint per ottenere una domanda e le sue risposte.
	 * @param ctx
	 * @returns
	 */
	async getCompleteQuestion(ctx: Context) {
		const body = ctx.request.body;
		const question_id = body.question_id;
		const token = process.env.SERVICE_KEY;

		const toReturn = {
			id: "",
			documentId: "",
			name: "",
			text: "",
			category: {
				documentId: "",
				id_category: "",
				name: "",
			},
			answers: [],
		};

		// Recupero la domanda
		const questionResponse = await fetch(
			`http://localhost:1337/api/questions/${question_id}?pLevel`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!questionResponse.ok) {
			ctx.status = questionResponse.status;
			ctx.body = { error: "Errore nel recupero della domanda" };
			return ctx;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const questionData: any = await questionResponse.json();
		const question = questionData.data;
		console.log("PIPOLINO: ", question);

		// Recupero le risposte legate alla domanda
		const answersResponse = await fetch(
			`http://localhost:1337/api/answers?filters[question_id][documentId][$eq]=${question_id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!answersResponse.ok) {
			ctx.status = answersResponse.status;
			ctx.body = { error: "Errore nel recupero delle risposte" };
			return ctx;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const answersData = (await answersResponse.json()) as any;
		const answers = answersData.data;

		for (const answer of answers) {
			console.log("ANSWER: ", answer);
			toReturn.answers.push({
				id: answer.id_answer,
				documentId: answer.documentId,
				text: answer.text,
				correction: answer.correction,
				score: answer.score,
			});
		}

		toReturn.id = question.id_question;
		toReturn.documentId = question.documentId;
		toReturn.name = question.name;
		toReturn.text = question.text;
		toReturn.category = {
			documentId: question.category_id.documentId,
			id_category: question.category_id.id_category,
			name: question.category_id.name,
		};

		ctx.status = 200;
		ctx.body = toReturn;
		return ctx;
	},
};
