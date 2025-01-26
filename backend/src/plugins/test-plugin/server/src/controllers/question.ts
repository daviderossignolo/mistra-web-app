import type { Context } from 'koa';
const { v4: uuidv4 } = require('uuid');
import questionService from '../services/question';
import categoryService from '../services/category';
import axios from 'axios';

export default {
    // Endpoint per creare una Question
    async createQuestion(ctx) {
        try {
            const { name, text, id_category, answer } = ctx.request.body;
            console.log(ctx.request.body);
            const id_question = uuidv4();
            const answers = answer.split(',').map(answer => answer.trim());

            const payload = {
                data: {
                    id_question,
                    name,
                    text,
                    id_category,
                    answers
                }
            };

            await axios.post('http://localhost:1337/api/questions', payload);

            ctx.body = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-question">
                    <title>Redirect</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                    <div class="bg-white p-8 rounded-lg shadow-lg">
                        <h1 class="text-2xl font-semibold text-green-600 mb-4">Question creata con successo</h1>
                        <p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
                    </div>
                </body>
            </html>`;
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async questionManagement(ctx: Context) {
        try {
            const getQuestionsHTML = await questionService.getQuestionsHTML();
            const getAnswersHTML = await questionService.getAnswersHTML();
            const getCategoriesHTML = await categoryService.getCategoriesHTML();

            ctx.body = `
            <html>
                <head>
                    <title>Gestione Questions</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 font-sans">
                    <div class="max-w-3xl mx-auto p-8">
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Creazione Question</h1>
                        <h3 class="text-xl font-medium text-gray-700 mb-4">Answers disponibili</h3>
                        <ul class="list-disc pl-8 mb-4">${getAnswersHTML}</ul>
                        <h3 class="text-xl font-medium text-gray-700 mb-4">Categorie disponibili</h3>
                        <ul class="list-disc pl-8 mb-4">${getCategoriesHTML}</ul>
                        <h3 class="text-xl font-medium text-gray-700 mb-4">Question esistenti</h3>
                        <ul class="list-disc pl-8 mb-4">${getQuestionsHTML}</ul>
                        <form method="POST" action="http://localhost:1337/api/test-plugin/create-question" enctype="application/json" class="bg-white p-6 rounded-lg shadow-lg">
                            <label for="name" class="block text-lg text-gray-800 mb-2">Name:</label>
                            <input type="text" name="name" id="name" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
                            <label for="text" class="block text-lg text-gray-800 mb-2">Text:</label>
                            <input type="text" name="text" id="text" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
                            <label for="id_category" class="block text-lg text-gray-800 mb-2">Category:</label>
                            <input type="text" name="id_category" id="id_category" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
                            <label for="answer" class="block text-lg text-gray-800 mb-2">Answer ids:</label>
                            <input type="text" name="answer" id="answer" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
                            <button type="submit" class="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">Crea Question</button>
                        </form>
                        <a href="http://localhost:1337/api/test-plugin/display-answer" class="text-blue-500 hover:underline mt-4 inline-block">Creare una Answer</a>
                        <br>
                        <a href="http://localhost:1337/api/test-plugin/search-test-Execution" class="text-blue-500 hover:underline mt-4 inline-block">Torna alla creazione del Test</a>
                    </div>
                </body>
            </html>`;
            ctx.type = 'html';
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    // Endpoint per modificare una Question
    async modifyQuestion(ctx: Context) {
		try {
			const { documentId } = ctx.query;
            const response = await axios.get(`http://localhost:1337/api/questions/${documentId}?populate=*`);
            const data = response.data.data;

            // Filtro i dati
            const filteredData = {
              id: data.id,
              documentId: data.documentId,
              id_question: data.id_question,
              name: data.name,
              text: data.text,
              id_category: data.id_category
                ? {
                    id: data.id_category.id,
                    documentId: data.id_category.documentId,
                    id_category: data.id_category.id_category,
                    name: data.id_category.name
                  }
                : null,
              answers: data.answers
                ? data.answers.map((answer) => ({
                    id: answer.id,
                    documentId: answer.documentId,
                    id_answer: answer.id_answer,
                    text: answer.text,
                    score: answer.score,
                    correction: answer.correction
                  }))
                : [],
              question_in_tests: data.question_in_tests
                ? data.question_in_tests.map((test) => ({
                    id: test.id,
                    documentId: test.documentId
                  }))
                : []
            };

            console.log(filteredData);

			const answers = Array.isArray(data.answers) ? data.answers : [];
	
			ctx.body = `
			<html>
				<head>
					<title>Modifica Question</title>
					<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
				</head>
				<body class="bg-gray-100 font-sans">
					<div class="max-w-3xl mx-auto p-8">
						<h1 class="text-3xl font-semibold text-gray-800 mb-6">Modifica Question</h1>
						<form action="http://localhost:1337/api/test-plugin/submit-modify-question/?documentId=${documentId}" method="POST" class="bg-white p-6 rounded-lg shadow-lg">
							<label for="name" class="block text-lg text-gray-800 mb-2">Name:</label>
							<input type="text" name="name" id="name" value="${data.name || ''}" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
							<label for="text" class="block text-lg text-gray-800 mb-2">Text:</label>
							<input type="text" name="text" id="text" value="${data.text || ''}" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
							<label for="id_category" class="block text-lg text-gray-800 mb-2">Category:</label>
							<input type="text" name="id_category" id="id_category" value="${data.id_category.documentId || ''}" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
							<label for="answer" class="block text-lg text-gray-800 mb-2">Answer ids:</label>
							<input type="text" name="answer" id="answer" value="${answers.map(answer => answer.documentId).join(',')}" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
							<button type="submit" class="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">Modifica Question</button>
                            <a href="/api/test-plugin/display-question" class="text-blue-500 hover:underline mt-4 inline-block">Torna alla visualizzazione delle Question</a>
						</form>
					</div>
				</body>
			</html>`;
			ctx.type = 'html';
		} catch (error) {
			ctx.body = { error: error.message };
		}
	},

    // Endpoint per sottoporre la modifica di una Question
    async submitModifyQuestion(ctx: Context) {
        try {
            const { documentId } = ctx.query;
            const { name, text, id_category, answer } = ctx.request.body;
            const answers = answer.split(',').map(answer => answer.trim());
            console.log(ctx.request.body);

            const payload = {
                data: {
                    name,
                    text,
                    id_category,
                    answers
                }
            };

            await axios.put(`http://localhost:1337/api/questions/${documentId}`, payload);

            ctx.body = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-question">
                    <title>Redirect</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 text-center p-8">
                    <h1 class="text-4xl font-bold text-green-600">Question modificata con successo</h1>
                    <p class="text-xl mt-4">Stai per essere reindirizzato...</p>
                </body>
            </html>`;
            ctx.type = 'html';
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    // Endpoint per eliminare una Question
    async deleteQuestion(ctx: Context) {
        try {
            const { documentId } = ctx.query;

            await axios.delete(`http://localhost:1337/api/questions/${documentId}`);

            ctx.body = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-question">
                    <title>Redirect</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 text-center p-8">
                    <h1 class="text-4xl font-bold text-red-600">Question eliminata con successo</h1>
                    <p class="text-xl mt-4">Stai per essere reindirizzato...</p>
                </body>
            </html>`;
            ctx.type = 'html';
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async getQuestions() {
        try {
            const response = await axios.get('http://localhost:1337/api/questions?populate=*');
            const filteredAnswers = response.data.data.map(data => ({
                id: data.id ? data.id : null,
                documentId: data.documentId,
                id_question: data.id_question,
                name: data.name,
                text: data.text,
                id_category: data.id_category
                    ? {
                        id: data.id_category.id ? data.id_category.id : null,
                        documentId: data.id_category.documentId,
                        id_category: data.id_category.id_category,
                        name: data.id_category.name
                    }
                  : null,
                answers: data.answers
                    ? data.answers.map((answer) => ({
                        id: answer.id ? answer.id : null,
                        documentId: answer.documentId,
                        id_answer: answer.id_answer,
                        text: answer.text,
                        score: answer.score,
                        correction: answer.correction
                    }))
                  : [],
                question_in_tests: data.question_in_tests
                    ? data.question_in_tests.map((test) => ({
                        id: test.id ? test.id : null,
                        documentId: test.documentId
                    }))
                  : []
            }));

            console.log(filteredAnswers)
            return response.data.data;
        
        } catch (error) {
            return `<li>Errore nel caricamento delle questions: ${error.message}</li>`;
        }
    }
};
