import type { Context } from 'koa';
import axios from 'axios';
import categoryService from '../services/category';
const { v4: uuidv4 } = require('uuid');

export default {
    async createCategory(ctx: Context) {
        try {
            const { name } = ctx.request.body;
            const id_category = uuidv4();

            await axios.post('http://localhost:1337/api/categories', {
              data: {
                id_category,
                name,
              },
            });

            ctx.body = `
                <html>
                    <head>
						<meta charset="UTF-8">
						<meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-category">
						<title>Redirect</title>
					</head>
                    <body>
                        <h1>Category creata con successo</h1>
                        <p>Stai per essere reindirizzato...</p>
                    </body>
                </html>`;
            ctx.type = 'html';
        } 
        catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async categoryManagement(ctx: Context) {
        try {
            const categoriesHTML = await categoryService.getCategoriesHTML();

            ctx.body = `
            <html>
                <head>
                    <title>Gestione Category</title>
                </head>
                <body>
                    <h1>Creazione Categories</h1>
                    <h3>Categories esistenti</h3>
                    <ul>${categoriesHTML}</ul>
                    <form method="POST" action="/api/test-plugin/create-category">
                      <label for="name">Name:</label>
                      <input type="text" name="name" required />
                      <button type="submit">Crea Category</button>
                      <br>
                      <a href="/api/test-plugin/display-answer">Indietro</a>
                    </form>
                </body>
            </html>`;
            ctx.type = 'html';
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async modifyCategory(ctx: Context) {
        try {
            const { documentId } = ctx.query; // Ottieni il documentId dalla query
            const response = await axios.get(`http://localhost:1337/api/categories/${documentId}`);
            const data = response.data.data;
            
            // Costruzione della pagina HTML con il form
            ctx.body = `
              <html>
              <body>
                <h1>Modify Category</h1>
                <form action="/api/test-plugin/submit-modify-category?documentId=${documentId}" method="POST">
                  <label for="name">Name:</label>
                  <input type="text" name="name" value="${data.name}" required />
                  <button type="submit">Save Changes</button>
                </form>
              </body>
              </html>`;
            ctx.type = 'html';
        } 
        catch (error) {
            ctx.body = { error: error.message };
        }
    },
  
    // funzione per gestire la PUT
    async submitModifyCategory(ctx: Context) {
        try {
          const { documentId } = ctx.query; // Ottieni il documentId dalla query
          const { name } = ctx.request.body; // Ottieni il nuovo valore di "name" dal body della richiesta
        
          // Effettua la richiesta PUT al server
          const response = await axios.put(`http://localhost:1337/api/categories/${documentId}`, {
            data: { name },
          });
      
          ctx.body = `
          <html>
              <head>
                  <meta charset="UTF-8">
                  <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-category">
                  <title>Redirect</title>
              </head>
              <body>
                  <h1>Category modificata con successo</h1>
                  <p>Stai per essere reindirizzato...</p>
              </body>
          </html>`;
          ctx.type = 'html';
        } catch (error) {
          ctx.body = { error: error.message };
        }
    },

    async deleteCategory(ctx: Context) {
        try {
            const { documentId } = ctx.query; // Ottieni il documentId dalla query

            // Effettua la richiesta DELETE al server
            await axios.delete(`http://localhost:1337/api/categories/${documentId}`);

            ctx.body = `
                <html>
                    <head>
						<meta charset="UTF-8">
						<meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-category">
						<title>Redirect</title>
					</head>
                    <body>
                        <h1>Category eliminata con successo</h1>
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
