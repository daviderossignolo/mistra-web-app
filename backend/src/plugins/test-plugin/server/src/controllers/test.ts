import axios from 'axios';

export default {
  async searchTest(ctx) {
    ctx.body = `
      <html>
        <head>
            <title>Test Eseguiti</title>
        </head>
        <body>
            <ul id="answers-list">
                ${(await this.getTestsHTML())}
            </ul>
            <br>
            <a href="http://localhost:1337/api/test-plugin/display-question">Crea Question</a>
        </body>
        </html>
    `;
    ctx.type = 'html';
  },


  // Funzione per ottenere la lista di answers esistenti
  async getTestsHTML() {
    try {
      const response = await axios.get('http://localhost:1337/api/test-executions');
      return response.data.data
        .map(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (test: any) =>
            `<li data-documentId="${test.documentId}">
              <strong>ID:</strong> ${test.id}, 
              <strong>documentId:</strong> ${test.documentId}, 
              <strong>Age:</strong> ${test.age}, 
              <strong>Score:</strong> ${test.score}
              <a href="http://localhost:1337/api/test-plugin/display-test/?documentId=${test.documentId}">Modifica</a>
            </li>`
        )
        .join('');
    } catch (error) {
      return `<li>Errore nel caricamento dei test: ${error.message}</li>`;
    }
  },  

  async displayTest(ctx) {
    try {
      const { documentId } = ctx.query;
      const response = await axios.get(`http://localhost:1337/api/test-executions/${documentId}`);
      const jsonResponse = JSON.stringify(response.data, null, 2);
      ctx.body =
          ` <html>
          <head>
              <title>Gestione Answers</title>
          </head>
          <body>
              <h1>Answers ${response.data.data.id}</h1>
              <ul id="answers-list">
                <strong>ID:</strong> ${response.data.data.id}, 
                <strong>documentId:</strong> ${response.data.data.documentId}, 
                <strong>Age:</strong> ${response.data.data.age}, 
                <strong>Score:</strong> ${response.data.data.score}
              </ul>
          </body>
          </html>
          `
      ctx.type = 'html';
    }
    catch (error) {
      ctx.body = { error: error.message };
    }
  },

  async submitTest(ctx) {
    
  },


  async getTestResults(ctx) {
    // Da implementare
  },
};
