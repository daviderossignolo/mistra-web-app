import type { Context } from 'koa';
import answerService from '../services/answer';
const { v4: uuidv4 } = require('uuid');
import axios from 'axios'; // Assicurati di avere axios installato con `yarn add axios`

export default {
	async createAnswer(ctx) {
    	try {
      		const { text, score, correction } = ctx.request.body;

      		// Calcola l'uuid
      		const id_answer = uuidv4(); // Genera un UUID

      		// Crea il nuovo answer
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
					</head>
					<body>
						<h1>Answer creata con successo</h1>
						<p>Stai per essere reindirizzato...</p>
					</body>
				</html>`;
			ctx.type = 'html';
      	} 
	  	catch (error) {
        	ctx.body = { error: error.message };
      	}
  	},

    async answerManagement(ctx) {
		try {
			const categoriesHTML = await answerService.getAnswersHTML();
        
			ctx.body = `
          	<html>
            	<head>
                	<title>Gestione Answers</title>
            	</head>
            	<body>
                	<h1>Answers esistenti</h1>
                	<ul id="answers-list">
                    	${categoriesHTML}
                	</ul>
            	</body>
            </html>
            <form method="POST" action="http://localhost:1337/api/test-plugin/create-answer" enctype="application/json">
            	<label for="text">Text:</label>
            	<input type="text" name="text" id="text" required><br>
            	<label for="score">Score:</label>
            	<select name="score" id="score" required>
            		<option value="0">0</option>
            		<option value="1">1</option>
            	</select><br>
            	<label for="correction">Correction:</label>
            	<textarea name="correction" id="correction"></textarea><br>
            	<button type="submit">Crea Answer</button>
            </form>
            <a href="http://localhost:1337/api/test-plugin/display-category">Crea una nuova category</a>
            <br>
            <a href="http://localhost:1337/api/test-plugin/display-question">Torna alla creazione delle question</a>
        `;
        ctx.type = 'html';
    	} catch (error) {
			ctx.body = { error: error.message };
		}
	},	
	
	async modifyAnswer(ctx: Context) {
		try{
			const { documentId } = ctx.query; // Ottieni il documentId dalla query
			const response = await axios.get(`http://localhost:1337/api/answers/${documentId}`);
			const data = response.data.data;
			
			// Costruzione della pagina HTML con il form
			ctx.body = `
				<html>
				<body>
					<h1>Modify Answer</h1>
					<form action="http://localhost:1337/api/test-plugin/submit-modify-answer?documentId=${documentId}" method="POST">
						<label for="text">Text:</label>
						<input type="text" name="text" value="${data.text}" required />
						<label for="score">Score:</label>
						<input type="number" name="score" value="${data.score}" required />
						<label for="correction">Correction:</label>
						<input type="text" name="correction" value="${data.correction}" required />
						<button type="submit">Modifica Answer</button>
					</form>
				</body>
				</html>`;
			ctx.type = 'html';
		}
		catch (error) {
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
					</head>
					<body>
						<h1>Answer modificata con successo</h1>
						<p>Stai per essere reindirizzato...</p>
					</body>
				</html>`;
			ctx.type = 'html';
		} 
		catch (error) {
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
					</head>
					<body>
						<h1>Answer eliminata con successo</h1>
						<p>Stai per essere reindirizzato...</p>
					</body>
				</html>`;
			ctx.type = 'html';
		} 
		catch (error) {
			ctx.body = { error: error.message };
		}
	}
};
