import { Context } from 'koa';
import { factories } from '@strapi/strapi';
const { v4: uuidv4 } = require('uuid');
import axios from 'axios'; // Assicurati di avere axios installato con `yarn add axios`

export default {
  async createAnswer(ctx) {
    try {
      const { text, score, correction } = ctx.request.body;

      // Ottieni il valore massimo di id_answer
      const response = await axios.get('http://localhost:1337/api/answers');
      const answers = response.data.data;

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

        ctx.body = `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Redirect</title>
              </head>
              <body>
                <h1>Answer creata con successo</h1>
                <a href="http://localhost:1337/api/test-plugin/display-answer">Indietro</a>
              </body>
              </html>`;
      } catch (error) {
          ctx.body = { error: error.message };
      }
  },

    async answerManagement(ctx) {
        ctx.body = `
          <html>
            <head>
                <title>Gestione Answers</title>
            </head>
            <body>
                <h1>Answers esistenti</h1>
                <ul id="answers-list">
                    ${(await this.getAnswersHTML())}
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
            <a href="http://localhost:1337/api/test-plugin/display-question">Torna alla creazione delle question</a>
            <br>
            <a href="http://localhost:1337/api/test-plugin/display-category">Crea una nuova category</a>
        `;
        ctx.type = 'html';
    },
  
    // Funzione per ottenere la lista di answers esistenti
    async getAnswersHTML() {
      try {
        const response = await axios.get('http://localhost:1337/api/answers');
        const jsonResponse = JSON.stringify(response.data, null, 2);
        return response.data.data
          .map(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (answer: any) =>
              `<li><strong>ID:</strong> ${answer.id}, <strong>Text:</strong> ${answer.text}, <strong>Score:</strong> ${answer.score} </li>`
          )
          .join('');
      } catch (error) {
        return `<li>Errore nel caricamento delle answers: ${error.message}</li>`;
      }
    },
  };
