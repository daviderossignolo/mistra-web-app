import type { Context } from "koa";

export default {
	/**
	 * Endpoint that create a category.
	 * @param ctx
	 * @returns
	 */
	async createCategory(ctx: Context) {
		const token = process.env.SERVICE_KEY;
		const body = ctx.request.body;

		console.log(body);

		const id_category = body.id_category;
		const name = body.name;

		if (!token) {
			ctx.status = 401;
			ctx.body = { error: "Unauthorized" };
			return;
		}

		const response = await fetch("http://localhost:1337/api/categories", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				data: {
					id_category: id_category,
					name: name,
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

		ctx.status = 200;

		return categoryData.data.documentId;
	},

	/**
	 * Endpoint che permette di modificare la categoria.
	 * @param ctx
	 * @returns il documentId della categoria modificata
	 */
	async modifyCategory(ctx: Context) {
		const token = process.env.SERVICE_KEY;
		const body = ctx.request.body;
		console.log(body);

		const categoryDocumentId = body.documentId;
		const categoryName = body.name;

		if (!token) {
			console.error("Chiave mancante nel file .env");
		}

		const response = await fetch(
			`http://localhost:1337/api/categories/${categoryDocumentId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					data: { name: categoryName },
				}),
			},
		);

		if (!response.ok) {
			ctx.status = response.status;
			ctx.body = { error: "Failed to get the Category" };
			return;
		}

		ctx.status = 200;
		ctx.body = { documentId: categoryDocumentId };

		return ctx;
	},

	/**
	 * Endpoint che permette di eliminare una categoria dal database.
	 * @param ctx
	 * @returns
	 */
	async deleteCategory(ctx: Context) {
		const token = process.env.SERVICE_KEY;
		const body = ctx.request.body;
		const documentId = body.documentId;

		if (!token) {
			ctx.status = 401;
			ctx.body = { error: "Unauthorized" };
			return;
		}

		const response = await fetch(
			`http://localhost:1337/api/categories/${documentId}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			},
		);

		if (!response.ok) {
			ctx.status = response.status;
			ctx.body = { error: "Errore nella cancellazione della Category" };
			return;
		}

		ctx.status = 200;
		ctx.body = { message: "Category eliminata con successo!" };
		return ctx;
	},

	/**
	 * Function that calls strapi API to get all categories.
	 * @returns {Promise<{id: string, id_category: string, name: string}[] | {error: string}>}
	 */
	async getCategories(ctx: Context) {
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
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error(
					`Errore nella richiesta: ${response.status} ${response.statusText}`,
				);
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const responseData: any = await response.json();

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
