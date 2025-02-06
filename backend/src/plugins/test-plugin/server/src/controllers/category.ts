import type { Context } from "koa";
import axios from "axios";
import categoryService from "../services/category";
const { v4: uuidv4 } = require("uuid");

export default {

	/**
	 * Endpoint that create a category.
	 * @param ctx
	 * @returns
	 */
	async createCategory(ctx: Context) {
		const { id_category, name } = ctx.request.body;
		console.log(ctx.request.body);

		const token = process.env.SERVICE_KEY;

		if (!token) {
			ctx.status = 401;
			ctx.body = { error: "Unauthorized" };
			return;
		}

		const response = await fetch("http://localhost:1337/api/categories", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`,
			},
			body: JSON.stringify({
				data: {
					id_category,
					name,
				},
			}),
		});

		if (!response.ok) {
			ctx.status = response.status;
			ctx.body = { error: "Errore nella creazione della Category" };
			return;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const categoryData = (await response.json()) as any;
		const id = categoryData.data.documentId;

		return id;
	},

	/**
	 * Endpoint to get a category.
	 * @param ctx
	 * @returns filtredData
	 */
	async modifyCategory(ctx: Context) {
		try {
			const { documentId } = ctx.query; // Ottieni il documentId dalla query

			const token = process.env.SERVICE_KEY;

			if (!token) {
				ctx.status = 401;
				ctx.body = { error: "Unauthorized" };
				return;
			}
			
			const response = await fetch(`http://localhost:1337/api/categories/${documentId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			});
			
			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Failed to get the Category" };
				return;
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const categoryData = (await response.json()) as any;

			const data = categoryData.data;

			const filteredData = {
				id: data.documentId,
				documentId: data.documentId,
				id_category: data.id_category,
				name: data.name,
			};

			ctx.status = 200;
			ctx.body = filteredData;

			// return ctx;
			return filteredData;

		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	/**
	 * Endpoint to submit the modified category.
	 * @param ctx
	 * @returns
	 */
	async submitModifyCategory(ctx: Context) {
		try {

			const { documentId } = ctx.query; // Ottieni il documentId dalla query
			const { name } = ctx.request.body; // Ottieni il nuovo valore di "name" dal body della richiesta

			const token = process.env.SERVICE_KEY;

			if (!token) {
				ctx.status = 401;
				ctx.body = { error: "Unauthorized" };
				return;
			}

			console.log(ctx.request.body);

			// Effettua la richiesta PUT al server
			const response = await fetch(`http://localhost:1337/api/categories/${documentId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
				body: JSON.stringify({
					data: { name },
				}),
			});			

			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Errore nella modifica della Category" };
				return;
			}

			ctx.status = 200;
			ctx.body = { message: "Category modificata con successo!" };

			return ctx;

		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	/**
	 * Endpoint to delete a category.
	 * @param ctx
	 * @returns
	 */
	async deleteCategory(ctx: Context) {
		try {
			const { documentId } = ctx.query; // Ottieni il documentId dalla query

			const token = process.env.SERVICE_KEY;

			if (!token) {
				ctx.status = 401;
				ctx.body = { error: "Unauthorized" };
				return;
			}

			const response = await fetch(`http://localhost:1337/api/categories/${documentId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				ctx.status = response.status;
				ctx.body = { error: "Errore nella cancellazione della Category" };
				return;
			}

			ctx.status = 200;
			ctx.body = { message: "Category eliminata con successo!" };
			return ctx;

		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	/**
	 * Function that calls strapi API to get all categories.
	 * @returns {Promise<{id: string, id_category: string, name: string}[] | {error: string}>}
	 */
	async getCategories(ctx : Context) {
		try {

			const token = process.env.SERVICE_KEY;

			if (!token) {
				ctx.status = 401;
				ctx.body = { error: "Unauthorized" };
				return;
			}

			const response = await fetch("http://localhost:1337/api/categories", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			});
		
			if (!response.ok) {
				throw new Error(`Errore nella richiesta: ${response.status} ${response.statusText}`);
			}
			
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const responseData : any = await response.json();

			const filteredCategories = responseData.data.map((category) => ({
				documentId: category.documentId,
				id_category: category.id_category,
				name: category.name,
			}));
		
			return filteredCategories;
		} catch (error) {
			return { error: error.message };
		}
		
	},
};
