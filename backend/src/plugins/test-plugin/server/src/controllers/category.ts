import { Context } from 'koa';
import { factories } from '@strapi/strapi';
const { v4: uuidv4 } = require('uuid');
import axios from 'axios'; // Assicurati di avere axios installato con `yarn add axios`

export default {
  async createCategory(ctx) {
    try {
      const { name } = ctx.request.body;
      // Calcola l'uuid
      const id_category = uuidv4(); // Genera un UUID

      // Crea la nuova category
      await axios.post('http://localhost:1337/api/categories', {
        data: {
          id_category,
          name,
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
                <h1>Category creata con successo</h1>
                <a href="http://localhost:1337/api/test-plugin/display-category">Indietro</a>
              </body>
              </html>`;
      } catch (error) {
          ctx.body = { error: error.message };
      }
  },

    async categoryManagement(ctx) {
        ctx.body = `
          <html>
            <head>
                <title>Gestione Categories</title>
            </head>
            <body>
                <h1>Categories esistenti</h1>
                <ul id="categories-list">
                    ${(await this.getCategoriesHTML())}
                </ul>
            </body>
            </html>
            <form method="POST" action="http://localhost:1337/api/test-plugin/create-category" enctype="application/json">
            <label for="name">Name:</label>
            <input type="text" name="name" id="name" required><br>
            <button type="submit">Crea Category</button>
            </form>
            <a href="http://localhost:1337/api/test-plugin/display-answer">Torna alla creazione delle answer</a>
        `;
        ctx.type = 'html';
    },
  
    // Funzione per ottenere la lista di categories esistenti
    async getCategoriesHTML() {
      try {
        const response = await axios.get('http://localhost:1337/api/categories');
        const jsonResponse = JSON.stringify(response.data, null, 2);
        return response.data.data
          .map(
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (category: any) =>
              `<li><strong>ID:</strong> ${category.documentId}, <strong>Text:</strong> ${category.name} </li>`
          )
          .join('');
      } catch (error) {
        return `<li>Errore nel caricamento delle categorys: ${error.message}</li>`;
      }
    },
  };
