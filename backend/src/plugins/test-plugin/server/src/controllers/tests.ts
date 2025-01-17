import type { Context } from 'koa';
const { v4: uuidv4 } = require('uuid');
import testsService from '../services/tests';
import questionService from '../services/question';
import axios from 'axios'; // Assicurati di avere axios installato con `yarn add axios`

export default {

    async createTest(ctx: Context) {
        try {
            const { name_test, description_test } = ctx.request.body;
            
            // Genera un UUID per id_test
            const id_test = uuidv4();
            
            // Struttura il payload correttamente
            const payload = {
                data: {
                    id_test,
                    name_test,
                    description_test,
                }
            };

            console.log(payload);
            
            // Creazione del Test con i dati forniti
            await axios.post('http://localhost:1337/api/tests', payload);
            
            // Pagina di conferma
            ctx.body = `
            <!DOCTYPE html>
            <html lang="en">
            	<head>
                	<meta charset="UTF-8">
					<meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-test">
					<title>Redirect</title>						
            	</head>
            	<body>
                	<h1>Question creata con successo</h1>
                	<p>Stai per essere reindirizzato...</p>
            	</body>
            </html>`
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
    },
    
    async testManagement(ctx: Context) {
        try {
            
            const getTestHTML = await testsService.getTestHTML();
            
            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Test Management</title>
                    </head>
                    <body>
                        <h1>Test Management</h1>
                        <h2>Tests</h2>
                        <ul>
                            ${getTestHTML}
                        </ul>
                    </body>
                </html>

                <form method="POST" action="http://localhost:1337/api/test-plugin/create-test" enctype="application/json">
        	    	<label for="name_test">Name:</label>
        	    	<input type="text" name="name_test" id="name_test" required><br>
        	    	<label for="description_test">Descrizione:</label>
            	    <textarea name="description_test" id="description_test"></textarea><br>
                    <button type="submit">Crea Test</button>
        	    </form>
                <br>
                <a href="http://localhost:1337/api/test-plugin/search-test">Torna alla pagina principale</a>
            `;
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
    },
    
    async modifyTest(ctx: Context) {
        try {
            const { documentId } = ctx.query;
            const response = await axios.get(`http://localhost:1337/api/tests/${documentId}?populate=*`);
            const data = response.data.data;

            ctx.body = `
                <html>
                    <head>
                        <title>Modifica Test</title>
                    </head>
                    <body>
                        <h1>Modifica Test</h1>
                            <form action="http://localhost:1337/api/test-plugin/submit-modify-test/?documentId=${documentId}" method="POST">
                                <label for="name_test">Name:</label>
                                <input type="text" name="name_test" id="name_test" value="${data.name_test || ''}" required><br>
                                <label for="description_test">Descrizione:</label>
                                <textarea name="description_test" id="description_test">${data.description_test || ''}</textarea><br>
                                <button type="submit">Modifica Test</button>
                            </form>
                    </body>
                </html>`;
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
        
    },
    
    async submitModifyTest(ctx: Context) {
        try {
            const { documentId } = ctx.query;
            const { name_test, description_test } = ctx.request.body;
            
            // Struttura il payload correttamente
            const payload = {
                data: {
                    name_test,
                    description_test,
                }
            };
            
            // Modifica il Test con i dati forniti
            await axios.put(`http://localhost:1337/api/tests/${documentId}`, payload);
            
            // Pagina di conferma
            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-test">
                        <title>Redirect</title>						
                    </head>
                    <body>
                        <h1>Test modificato con successo</h1>
                        <p>Stai per essere reindirizzato...</p>
                    </body>
                </html>`;
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async deleteTest(ctx: Context) {
        try {
            const { documentId } = ctx.query;
            
            // Elimina il Test con l'id fornito
            await axios.delete(`http://localhost:1337/api/tests/${documentId}`);
            
            // Pagina di conferma
            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-test">
                        <title>Redirect</title>
                    </head>
                    <body>
                        <h1>Test eliminato con successo</h1>
                        <p>Stai per essere reindirizzato...</p>
                    </body>
                </html>`;
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async addQuestionToTest(ctx: Context) {
        try {
            const { documentId } = ctx.query;

            const getQuestionHTML = await questionService.getQuestionsHTML();
            const response = await axios.get(`http://localhost:1337/api/tests/${documentId}?populate=*`);
            
            const data = response.data.data;

            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Test Management</title>
                    </head>
                    <body>
                        <h1>Add Question to Test</h1>
                        <h2>Questions</h2>
                        <ul>
                            ${getQuestionHTML}
                        </ul>
                        <h2>Test ${data.name_test}</h2>
                        <label for="id">ID:</label>
                        <label for="id">${data.id_test || ''}</label>
                        <label for="name_test">Name:</label>
                        <label for="name_test">${data.name_test || ''}
                        <label for="description_test">Descrizione:</label>
                        <label for="description_test">${data.description_test || ''}<br>
                        <form method="POST" action="http://localhost:1337/api/test-plugin/create-QuestionInTest/?id_test=${documentId}" enctype="application/json">
				            <label for="id_question">Question:</label>
				            <input type="text" name="id_question" id="id_question" required><br>
                            <button type="submit">Add Question</button>
                        </form>
                    </body>
                </html>
            `;
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async createQuestionInTest(ctx: Context) {
        try {
            const id_test = ctx.query.id_test;
            const { id_question } = ctx.request.body;

            const payload = {
                data: {
                    id_question,
                    id_test
                }
            };

            console.log(payload);

            await axios.post('http://localhost:1337/api/question-in-tests', payload);

            // Pagina di conferma
            ctx.body = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/add-question-to-test/?documentId=${id_test}">
                    <title>Redirect</title>						
                </head>
                <body>
                    <h1>Question aggiunta la Test con successo</h1>
                    <p>Stai per essere reindirizzato...</p>
                </body>
            </html>`;
        } catch (error) {
            ctx.body = { error: error.message };
        }
    }

}