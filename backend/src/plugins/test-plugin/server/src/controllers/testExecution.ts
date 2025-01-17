import type { Context } from 'koa';
const { v4: uuidv4 } = require('uuid');
import axios from 'axios';
import testService from '../services/testExecution';

export default {
  async searchTestExecution(ctx: Context) {
    const getTestExecutionsHTML = await testService.getTestExecutionsHTML();
    
    ctx.body = `
      <html>
        <head>
            <title>Test Eseguiti</title>
        </head>
        <body>
            <h1>Test Eseguiti</h1>
            <form method="GET" action="http://localhost:1337/api/test-plugin/search-by-id">
                <label for="testId">Cerca per ID:</label>
                <input type="text" id="testId" name="testId" placeholder="Inserisci ID">
                <button type="submit">Cerca</button>
            </form>
            <ul id="answers-list">
                ${getTestExecutionsHTML}
            </ul>
            <br>
            <a href="http://localhost:1337/api/test-plugin/display-question">Crea Question</a>
            <a href="http://localhost:1337/api/test-plugin/display-test">Visualizza Test</a>
        </body>
      </html>
    `;
    ctx.type = 'html';
  },

  async searchById(ctx: Context) {
    try {
      const { testId } = ctx.query;

      if (!testId) {
        ctx.body = '<p>Errore: ID non fornito</p>';
        ctx.type = 'html';
        return;
      }

      const testExecutionHTML = await testService.getTestExecutionById(testId as string);
      ctx.body = `
        <html>
          <head>
              <title>Risultato Ricerca</title>
          </head>
          <body>
              <h1>Risultato della Ricerca</h1>
              <ul id="answers-list">
                  ${testExecutionHTML}
              </ul>
              <a href="http://localhost:1337/api/test-plugin/search-test">Torna alla lista</a>
          </body>
        </html>
      `;
      ctx.type = 'html';
    } catch (error) {
      ctx.body = `<p>Errore: ${error.message}</p>`;
      ctx.type = 'html';
    }
  },
};
