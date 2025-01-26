import type { Context } from "koa";
import axios from "axios";
import categoryService from "../services/category";
const { v4: uuidv4 } = require("uuid");

export default {
	async createCategory(ctx: Context) {
		const { id_category, name } = ctx.request.body;
		console.log(ctx.request.body);

		const response = await fetch("http://localhost:1337/api/categories", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				data: {
					id_category,
					name,
				},
			}),
		});

		return response.json();
	},

	async categoryManagement(ctx: Context) {
		try {
			const categoriesHTML = await categoryService.getCategoriesHTML();

			ctx.body = `
            <html>
                <head>
                    <title>Gestione Category</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 font-sans">
                    <div class="max-w-4xl mx-auto p-8">
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Gestione delle Categories</h1>
                        <h3 class="text-xl font-medium text-gray-700 mb-4">Categories esistenti</h3>
                        <ul class="mb-6">
                            ${categoriesHTML}
                        </ul>
                        <form method="POST" action="/api/test-plugin/create-category" class="bg-white p-6 rounded-lg shadow-lg">
                            <label for="name" class="block text-lg text-gray-800">Name:</label>
                            <input type="text" name="name" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
                            <button type="submit" class="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">Crea Category</button>
                            <br>
                            <a href="/api/test-plugin/display-answer" class="text-blue-500 hover:underline mt-4 inline-block">Indietro</a>
                        </form>
                    </div>
                </body>
            </html>`;
			ctx.type = "html";
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	async modifyCategory(ctx: Context) {
		try {
			const { documentId } = ctx.query; // Ottieni il documentId dalla query
			const response = await axios.get(
				`http://localhost:1337/api/categories/${documentId}`,
			);
			const data = response.data.data;

			const filteredData = {
				id: data.id,
				documentId: data.documentId,
				id_category: data.id_category,
				name: data.name,
			};
			console.log(filteredData);

			ctx.body = `
            <html>
                <head>
                    <title>Modifica Categoria</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 font-sans">
                    <div class="max-w-3xl mx-auto p-8">
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Modifica Categoria</h1>
                        <form action="/api/test-plugin/submit-modify-category?documentId=${documentId}" method="POST" class="bg-white p-6 rounded-lg shadow-lg">
                            <label for="name" class="block text-lg text-gray-800">Nome:</label>
                            <input type="text" name="name" value="${data.name}" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
                            <button type="submit" class="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">Salva Modifiche</button>
                            <br>
                            <a href="/api/test-plugin/display-category" class="text-blue-500 hover:underline mt-4 inline-block">Torna alla visualizzazione delle category</a>
                        </form>
                    </div>
                </body>
            </html>`;
			ctx.type = "html";
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	// funzione per gestire la PUT
	async submitModifyCategory(ctx: Context) {
		try {
			const { documentId } = ctx.query; // Ottieni il documentId dalla query
			const { name } = ctx.request.body; // Ottieni il nuovo valore di "name" dal body della richiesta
			console.log(ctx.request.body);

			// Effettua la richiesta PUT al server
			const response = await axios.put(
				`http://localhost:1337/api/categories/${documentId}`,
				{
					data: { name },
				},
			);

			ctx.body = `
          <html>
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-category">
                  <title>Redirect</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                    <div class="bg-white p-8 rounded-lg shadow-lg">
                        <h1 class="text-2xl font-semibold text-green-600 mb-4">Categoria Modificata con Successo!</h1>
                        <p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
                    </div>
                </body>
          </html>`;
			ctx.type = "html";
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	async deleteCategory(ctx: Context) {
		try {
			const { documentId } = ctx.query; // Ottieni il documentId dalla query

			await axios.delete(`http://localhost:1337/api/categories/${documentId}`);

			ctx.body = `
                <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-category">
                        <title>Redirect</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                        <div class="bg-white p-8 rounded-lg shadow-lg">
                            <h1 class="text-2xl font-semibold text-red-600 mb-4">Categoria Eliminata con Successo!</h1>
                            <p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
                        </div>
                    </body>
                </html>`;
			ctx.type = "html";
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

	async getCategories() {
		try {
			const response = await axios.get("http://localhost:1337/api/categories");
			const filteredCategories = response.data.data.map((category) => ({
				id: category.id,
				documentId: category.documentId,
				id_category: category.id_category,
				name: category.name,
			}));
			console.log(filteredCategories);
			return filteredCategories;
		} catch (error) {
			return `<li>Errore nel caricamento delle categories: ${error.message}</li>`;
		}
	},
};
