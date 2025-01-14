import type { Context } from 'koa';
const { v4: uuidv4 } = require('uuid');
import axios from 'axios';

export default {
  // Endpoint per creare una Question
  async createQuestion(ctx) {
    try {
        const { name, text, id_category, answer } = ctx.request.body;

        console.log('Payload ricevuto:', ctx.request.body);
        
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
        ctx.body = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Successo</title>
            </head>
            <body>
                <h1>Question creata con successo</h1>
                <a href="http://localhost:1337/api/test-plugin/display-question">Torna indietro</a>
            </body>
            </html>`;
    } catch (error) {
        ctx.body = { error: error.message };
    }
},

  // Endpoint per gestire la visualizzazione delle Questions
  async questionManagement(ctx: Context) {
    ctx.body = `
          <html>
            <head>
                <title>Gestione Questions</title>
            </head>
            <body>
                <h1>Creazione Question</h1>
                <h3>Answers disponibili</h3>
                <ul id="answers-list">
                    ${(await this.getAnswersHTML())}
                </ul>
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
            <a href="http://localhost:1337/api/test-plugin/display-answer">Clicca qui per creare una Answer</a>
        `;
    ctx.type = 'html';
  },

  async getAnswersHTML() {
    try {
      const response = await axios.get('http://localhost:1337/api/answers/?populate=*');
      const answers = response.data.data;

    // Filtra le answers con id_question null
    const filteredAnswers = answers.filter(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (answer: any) => answer.id_question === null
    );

    return filteredAnswers
        .map(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (answer: any) =>
            `<li><strong>ID:</strong> ${answer.documentId}, <strong>Text:</strong> ${answer.text}, <strong>Score:</strong> ${answer.score} </li>`
        ).join('');
    } catch (error) {
      return `<li>Errore nel caricamento delle answers: ${error.message}</li>`;
    }
  },

  // Funzione per ottenere l'elenco di Questions esistenti
  async getQuestionsHTML() {
    try {
      const response = await axios.get('http://localhost:1337/api/questions?populate=*');
      const questions = response.data.data;

      return questions
        .map((question: { id_question: string; name: string; text: string; answers: { id_answer: string; text: string; score: number; }[]; }) => {
          const answersHTML = question.answers
            .map(
              (answer: { id_answer: string; text: string; score: number; }) =>
                `<li><strong>ID:</strong> ${answer.id_answer}, <strong>Text:</strong> ${answer.text}, <strong>Score:</strong> ${answer.score}</li>`
            )
            .join('');

          return `
            <ul>
              <li>
                <strong>Question ID:</strong> ${question.id_question}
                <br>
                <strong>Name:</strong> ${question.name}
                <br>
                <strong>Text:</strong> ${question.text}
                <br>
                <strong>Answers:</strong>
                <ul>${answersHTML}</ul>
              </li>
            </ul>`;
        })
        .join('');
    } catch (error) {
      return `<li>Errore nel caricamento delle questions: ${error.message}</li>`;
    }
  },
};
