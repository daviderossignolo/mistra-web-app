import type { Context } from "koa";
const { v4: uuidv4 } = require("uuid");
import questionService from "../services/question";
import categoryService from "../services/category";
import axios from "axios";

export default {
	/**
	 * Endpoint per la creazione di una domanda.
	 * @param ctx
	 * @returns
	 */
	async createQuestion(ctx: Context) {
		const { id_question, name, text, category_id } = ctx.request.body;
		const token = process.env.SERVICE_KEY;

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
				"Authorization": `Bearer ${token}`,
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
		const id = questionData.data.documentId;

		ctx.status = 200;
		ctx.body = { question_id: id };

		return ctx;
	},

	/**
	 * Endpoint per la visualizzazione di una domanda.
	 * @param ctx
	 * @returns filtredData
	 */
	async modifyQuestion(ctx: Context) {
		try {
			const { documentId } = ctx.query;

			const token = process.env.SERVICE_KEY;

			if (!token) {
				ctx.status = 401;
				ctx.body = { error: "Unauthorized" };
				return ctx;
			}

			const response = await fetch(`http://localhost:1337/api/questions/${documentId}?populate=*`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Errore nel caricamento della domanda" };
				return ctx;
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const responseData : any = await response.json();
			const data = responseData.data;

			// Filtro i dati
			const filteredData = {
				id: data.id,
				documentId: data.documentId,
				id_question: data.id_question,
				name: data.name,
				text: data.text,
				id_category: data.category_id
					? {
							id: data.category_id.id,
							documentId: data.category_id.documentId,
							id_category: data.category_id.id_category,
							name: data.category_id.name,
						}
					: null,
			};

			console.log(filteredData);

			ctx.status = 200;
			ctx.body = filteredData;

			//return ctx;
			return filteredData;
			
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	/**
	 * Endpoint per la modifica di una domanda.
	 * @param ctx
	 * @returns
	 */
	async submitModifyQuestion(ctx: Context) {
		try {
			
			const { documentId } = ctx.query;
			const { name, text, category_id } = ctx.request.body;

			const token = process.env.SERVICE_KEY;

			if (!token) {
				ctx.status = 401;
				ctx.body = { error: "Unauthorized" };
				return ctx;
			}

			console.log(ctx.request.body);

			//si può passare solo documentId come category_id (occhio che è cambiato da id_category a category_id)
			const payload = {
				data: {
					name,
					text,
					category_id,
				},
			};

			const response = await fetch(`http://localhost:1337/api/questions/${documentId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Errore nella modifica della domanda" };
				return ctx;
			}

			ctx.status = 200;
			ctx.body = { message: "Questiom modified successfully" };

			return ctx;
			
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	/**
	 * Endpoint per l'eliminazione di una domanda.
	 * @param ctx
	 * @returns
	 */
	async deleteQuestion(ctx: Context) {
		try {
			const { documentId } = ctx.query;

			const token = process.env.SERVICE_KEY;

			if (!token) {
				ctx.status = 401;
				ctx.body = { error: "Unauthorized" };
				return ctx;
			}

			const response = await fetch(`http://localhost:1337/api/questions/${documentId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Errore nell'eliminazione della domanda" };
				return ctx;
			}
			
			ctx.status = 200;
			ctx.body = { message: "Question deleted successfully" };
			return ctx;

		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	/**
	 * Endpoint per ottenere le domande.
	 * @param ctx
	 * @returns
	 */
	async getQuestions(ctx) {
		try {

			const token = process.env.SERVICE_KEY;

			if (!token) {
				ctx.status = 401;
				ctx.body = { error: "Unauthorized" };
				return ctx;
			}

			const response = await fetch("http://localhost:1337/api/questions?populate=*", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Errore nel caricamento delle domande" };
				return ctx;
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const responseData : any = await response.json();

			const data = responseData.data;
			
			const filteredAnswers = responseData.data.map((data) => ({
				id: data.id ?? null, // Usa ?? per maggiore sicurezza
				documentId: data.documentId,
				id_question: data.id_question,
				name: data.name,
				text: data.text,
				id_category: data.category_id
					? {
							id: data.category_id.id ?? null,
							documentId: data.category_id.documentId,
							id_category: data.category_id.id_category,
							name: data.category_id.name,
						}
					: null,
			}));
			
			console.log(filteredAnswers);
			return filteredAnswers;		

		} catch (error) {
			ctx.body = { error: error.message };
		}
	},
};
