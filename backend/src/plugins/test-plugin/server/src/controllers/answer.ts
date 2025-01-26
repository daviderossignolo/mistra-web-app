import type { Context } from 'koa';
import answerService from '../services/answer';
const { v4: uuidv4 } = require('uuid');
import axios from 'axios';

export default {
    async createAnswer(ctx) {
        try {
            const { text, score, correction } = ctx.request.body;
            const id_answer = uuidv4();

            await axios.post('http://localhost:1337/api/answers', {
                data: {
                    id_answer,
                    text,
                    score,
                    correction,
                },
            });

            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-answer">
                        <title>Redirect</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                        <div class="bg-white p-8 rounded-lg shadow-lg text-center">
                            <h1 class="text-2xl font-semibold text-green-600 mb-4">Answer Creata con Successo!</h1>
                            <p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
                        </div>
                    </body>
                </html>`;
            ctx.type = 'html';
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async answerManagement(ctx) {
        try {
            const answersHTML = await answerService.getAnswersHTML();

            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <title>Gestione Answers</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 font-sans">
                        <div class="max-w-4xl mx-auto p-8">
                            <h1 class="text-3xl font-semibold text-gray-800 mb-6">Gestione delle Answers</h1>
                            <h3 class="text-xl font-medium text-gray-700 mb-4">Answers esistenti</h3>
                            <ul class="mb-6">
                                ${answersHTML}
                            </ul>
                            <form method="POST" action="/api/test-plugin/create-answer" class="bg-white p-6 rounded-lg shadow-lg">
                                <label for="text" class="block text-lg text-gray-800">Text:</label>
                                <input type="text" name="text" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
                                <label for="score" class="block text-lg text-gray-800">Score:</label>
                                <select name="score" required class="border border-gray-300 p-2 rounded-lg w-full mb-4">
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                </select>
                                <label for="correction" class="block text-lg text-gray-800">Correction:</label>
                                <textarea name="correction" required class="border border-gray-300 p-2 rounded-lg w-full mb-4"></textarea>
                                <button type="submit" class="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">Crea Answer</button>
                                <br>
                                <a href="/api/test-plugin/display-category" class="text-blue-500 hover:underline mt-4 inline-block">Crea una nuova category</a>
								<br>
								<a href="/api/test-plugin/display-question" class="text-blue-500 hover:underline mt-4 inline-block">Torna alla creazione delle question</a>
                            </form>
                        </div>
                    </body>
                </html>`;
            ctx.type = 'html';
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async modifyAnswer(ctx: Context) {
        try {
            const { documentId } = ctx.query;
            const response = await axios.get(`http://localhost:1337/api/answers/${documentId}`);
            const data = response.data.data;

            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <title>Modifica Answer</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 font-sans">
                        <div class="max-w-3xl mx-auto p-8">
                            <h1 class="text-3xl font-semibold text-gray-800 mb-6">Modifica Answer</h1>
                            <form action="/api/test-plugin/submit-modify-answer?documentId=${documentId}" method="POST" class="bg-white p-6 rounded-lg shadow-lg">
                                <label for="text" class="block text-lg text-gray-800">Text:</label>
                                <input type="text" name="text" value="${data.text}" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
                                <label for="score" class="block text-lg text-gray-800">Score:</label>
                                <input type="number" name="score" value="${data.score}" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
                                <label for="correction" class="block text-lg text-gray-800">Correction:</label>
                                <textarea name="correction" required class="border border-gray-300 p-2 rounded-lg w-full mb-4">${data.correction}</textarea>
                                <button type="submit" class="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">Salva Modifiche</button>
								<br>
								<a href="/api/test-plugin/display-answer" class="text-blue-500 hover:underline mt-4 inline-block">Torna alla visualizzazione delle answer</a>
                            </form>
                        </div>
                    </body>
                </html>`;
            ctx.type = 'html';
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async submitModifyAnswer(ctx: Context) {
        try {
            const { documentId } = ctx.query;
            const { text, score, correction } = ctx.request.body;

            await axios.put(`http://localhost:1337/api/answers/${documentId}`, {
                data: {
                    text,
                    score,
                    correction,
                },
            });

            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-answer">
                        <title>Redirect</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                        <div class="bg-white p-8 rounded-lg shadow-lg text-center">
                            <h1 class="text-2xl font-semibold text-green-600 mb-4">Answer Modificata con Successo!</h1>
                            <p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
                        </div>
                    </body>
                </html>`;
            ctx.type = 'html';
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async deleteAnswer(ctx: Context) {
        try {
            const { documentId } = ctx.query;

            await axios.delete(`http://localhost:1337/api/answers/${documentId}`);

            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-answer">
                        <title>Redirect</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                        <div class="bg-white p-8 rounded-lg shadow-lg text-center">
                            <h1 class="text-2xl font-semibold text-red-600 mb-4">Answer Eliminata con Successo!</h1>
                            <p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
                        </div>
                    </body>
                </html>`;
            ctx.type = 'html';
        } catch (error) {
            ctx.body = { error: error.message };
        }
    }
};
