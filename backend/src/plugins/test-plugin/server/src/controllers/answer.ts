import type { Context } from "koa";
import answerService from "../services/answer";
const { v4: uuidv4 } = require("uuid");
import axios from "axios";

export default {
	/**
	 * Endpoin per la creazione di una risposta.
	 * @param ctx
	 * @returns
	 */
	async createAnswer(ctx: Context) {
		const { id_answer, text, correction, score, question_id } =
			ctx.request.body;

		// Faccio la chiamata API a Strapi per creare la Question
		const response = await fetch("http://localhost:1337/api/answers", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				data: {
					id_answer: id_answer,
					text: text,
					correction: correction,
					score: score,
					question_id: question_id,
				},
			}),
		});

		if (!response.ok) {
			ctx.status = response.status;
			ctx.body = { error: "Errore nella creazione della risposta" };
			return ctx;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const answerData: any = await response.json();
		const id = answerData.data.documentId;

		ctx.status = 200;
		ctx.body = { answer_id: id };

		return ctx;
	},

	async modifyAnswer(ctx: Context) {
		try {
			const { documentId } = ctx.query;
			const response = await fetch(`http://localhost:1337/api/answers/${documentId}?populate=*`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Errore nel caricamento della risposta" };
				return ctx;
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const answerData : any = await response.json();
			const data = answerData.data;

			const filteredData = {
				id: data.id,
				documentId: data.documentId,
				id_answer: data.id_answer,
				text: data.text,
				score: data.score,
				correction: data.correction,
				id_question: data.question_id
					? {
							id: data.question_id.id,
							documentId: data.question_id.documentId,
							id_question: data.question_id.id_question,
							name: data.question_id.name,
							text: data.question_id.text,
						}
					: null,
			};

			console.log(filteredData);

			ctx.status = 200;
			ctx.body = filteredData;
			
			// return ctx;
			return filteredData;
			
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	async submitModifyAnswer(ctx: Context) {
		try {
			const { documentId } = ctx.query;
			const { text, score, correction } = ctx.request.body;
			console.log(ctx.request.body);
			const response = await fetch(`http://localhost:1337/api/answers/${documentId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					data: {
						text,
						score,
						correction,
					},
				}),
			});

			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Errore nella modifica della risposta" };
				return ctx;
			}

			ctx.status = 200;
			ctx.body = { message: "Risposta modificata con successo!" };

			return ctx;
			
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	async deleteAnswer(ctx: Context) {
		try {
			const { documentId } = ctx.query;

			const response = await fetch(`http://localhost:1337/api/answers/${documentId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});
			
			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Errore nella cancellazione della risposta" };
				return ctx;
			}

			ctx.status = 200;
			ctx.body = { message: "Risposta eliminata con successo!" };
			return ctx
			
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	async getAnswers(ctx: Context) {
		try {
			const response = await fetch("http://localhost:1337/api/answers?populate=*", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const responseData : any = await response.json(); // Converte la risposta in JSON
			
			const filteredAnswers = responseData.data.map((answer) => ({
				id: answer.id ?? null, 
				documentId: answer.documentId,
				id_answer: answer.id_answer,
				text: answer.text,
				score: answer.score,
				correction: answer.correction,
				id_question: answer.question_id
					? {
							id: answer.question_id.id,
							documentId: answer.question_id.documentId,
							id_question: answer.question_id.id_question,
							name: answer.question_id.name,
							text: answer.question_id.text,
						}
					: null,
			}));
			
			ctx.status = 200;
			ctx.body = filteredAnswers;
			
			// return ctx;
			return filteredAnswers;		

		} catch (error) {
			return `<li>Errore nel caricamento delle answers: ${error.message}</li>`;
		}
	},

	async getFreeAnswers(ctx: Context) {
		try {
			const response = await fetch("http://localhost:1337/api/answers/?populate=*", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			
			// biome-ignore lint/suspicious/noExplicitAny: <explanation
			const responseData : any = await response.json();
			const answers = responseData.data;
			
			// Filtra le answers con id_question null
			const FreeAnswers = answers.filter((answer) => answer.question_id === null);
			
			const filteredAnswers = FreeAnswers.map((answer) => ({
				id: answer.id ?? null, 
				documentId: answer.documentId,
				id_answer: answer.id_answer,
				text: answer.text,
				score: answer.score,
				correction: answer.correction,
				id_question: answer.question_id
					? {
							id: answer.question_id.id,
							documentId: answer.question_id.documentId,
							id_question: answer.question_id.id_question,
							name: answer.question_id.name,
							text: answer.question_id.text,
						}
					: null, 
			}));
			
			ctx.status = 200;
			ctx.body = filteredAnswers;

			//return ctx;
			return filteredAnswers;			
		} catch (error) {
			console.error(`Errore nel caricamento delle answers: ${error.message}`);
			return `<li>Errore nel caricamento delle answers: ${error.message}</li>`;
		}
	},
};
