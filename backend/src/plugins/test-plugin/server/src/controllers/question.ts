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

        	// Genera un UUID per id_question
        	const id_question = uuidv4();

        	// Converte la stringa di risposte in un array
        	const answers = answer.split(',').map(answer => answer.trim())
        
        	// Struttura il payload correttamente
        	const payload = {
            	data: {
                	id_question,
                	name,
                	text,
                	id_category,
                	answers 
            	}
        	};

        	// Creazione della Question con i dati forniti
        	await axios.post('http://localhost:1337/api/questions', payload);

        	// Pagina di conferma
        	ctx.body = `
				<!DOCTYPE html>
            	<html lang="en">
            		<head>
            	    	<meta charset="UTF-8">
						<meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-question">
						<title>Redirect</title>						
            		</head>
            		<body>
            	    	<h1>Question creata con successo</h1>
            	    	<p>Stai per essere reindirizzato...</p>
            		</body>
            	</html>`;
    	} catch (error) {
        	ctx.body = { error: error.message };
    	}
	},

  	// Endpoint per gestire la visualizzazione delle Questions
  	async questionManagement(ctx: Context) {
		try {

			const getQuestionsHTML = await questionService.getQuestionsHTML();
			const getAnswersHTML = await questionService.getAnswersHTML();
			const getCategoriesHTML = await categoryService.getCategoriesHTML();
			
    		ctx.body = `
        		<html>
        	    	<head>
        	    	    <title>Gestione Questions</title>
        	    	</head>
        	    	<body>
        	    	    <h1>Creazione Question</h1>
        	    	    <h3>Answers disponibili</h3>
        	    	    <ul>${getAnswersHTML}</ul>
						<h3>Categorie disponibili</h3>
        	    	    <ul>${getCategoriesHTML}</ul>
						<h3>Question esistenti</h3>
						<ul>${getQuestionsHTML}</ul>
        	    	</body>
        	    </html>
        	    <form method="POST" action="http://localhost:1337/api/test-plugin/create-question" enctype="application/json">
        	    	<label for="name">Name:</label>
        	    	<input type="text" name="name" id="name" required><br>
        	    	<label for="text">Text:</label>
        	    	<input type="text" name="text" id="text" required><br>
        	    	<label for="id_category">Category:</label>
        	    	<input type="text" name="id_category" id="id_category" required><br>
        	    	<label for="answer">Answer ids:</label>
        	    	<input type="text" name="answer" id="answer" required><br>
        	    	<button type="submit">Crea Answer</button>
        	    </form>
        	    <a href="http://localhost:1337/api/test-plugin/display-answer">Creare una Answer</a>
        	    <br>
        	    <a href="http://localhost:1337/api/test-plugin/search-test">Torna alla creazione del Test</a>
        	`;
    		ctx.type = 'html';
		}
		catch (error) {
			ctx.body = { error: error.message };
		}	
  	},

  	async modifyQuestion(ctx: Context) {
		try {
		  const { documentId } = ctx.query;
		  const response = await axios.get(`http://localhost:1337/api/questions/${documentId}?populate=*`);
		  const data = response.data.data;
	  
		  // Assicurati che `answers` sia sempre un array
		  const answers = Array.isArray(data.answers) ? data.answers : [];
	  
		  // Costruzione della pagina HTML con il form
		  ctx.body = `
			<html>
			  <head>
				<title>Modifica Question</title>
			  </head>
			  <body>
				<h1>Modifica Question</h1>
				<form action="http://localhost:1337/api/test-plugin/submit-modify-question/?documentId=${documentId}" method="POST">
				  <label for="name">Name:</label>
				  <input type="text" name="name" id="name" value="${data.name || ''}" required><br>
				  <label for="text">Text:</label>
				  <input type="text" name="text" id="text" value="${data.text || ''}" required><br>
				  <label for="id_category">Category:</label>
				  <input type="text" name="id_category" id="id_category" value="${data.id_category || ''}" required><br>
				  <label for="answer">Answer ids:</label>
				  <input type="text" name="answer" id="answer" value="${answers.map(answer => answer.id_answer).join(',')}" required><br>
				  <button type="submit">Modifica Question</button>
				</form>
			  </body>
			</html>`;
		  ctx.type = 'html';
		} catch (error) {
		  ctx.body = { error: error.message };
		}
	},

  	async submitModifyQuestion(ctx: Context) {
		try {
			const { documentId } = ctx.query;
			const { name, text, id_category, answer } = ctx.request.body;

			// Converte la stringa di risposte in un array
			const answers = answer.split(',').map(answer => answer.trim())

			// Struttura il payload correttamente
			const payload = {
				data: {
					name,
					text,
					id_category,
					answers
				}
			};

			await axios.put(`http://localhost:1337/api/questions/${documentId}`, payload);

			// Pagina di conferma
			ctx.body = `
				<!DOCTYPE html>
				<html lang="en">
					<head>
						<meta charset="UTF-8">
						<meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-question">
						<title>Redirect</title>
					</head>
					<body>
						<h1>Question modificata con successo</h1>
						<p>Stai per essere reindirizzato...</p>
					</body>
				</html>`;
			ctx.type = 'html';
		}
		catch (error) {
			ctx.body = { error: error.message };
		}
  	},

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
					</head>
					<body>
						<h1>Question eliminata con successo</h1>
						<p>Stai per essere reindirizzato...</p>
					</body>
				</html>`;
			ctx.type = 'html';
		}
		catch (error) {
			ctx.body = { error: error.message };
		}
  	},	
};
