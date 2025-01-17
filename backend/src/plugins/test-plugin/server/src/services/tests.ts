import axios from 'axios';

export default {

    async getTestHTML() {
        try {
            const response = await axios.get('http://localhost:1337/api/tests');
            return response.data.data
          .map(
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (test: any) => `
                <li>
                  <strong>ID:</strong> ${test.documentId}, 
                  <strong>Name:</strong> ${test.name_test}
                  <strong>Description:</strong> ${test.description_test}
                  <a href="/api/test-plugin/modify-test/?documentId=${test.documentId}">Modifica</a>
                  <a href="/api/test-plugin/add-question-to-test/?documentId=${test.documentId}">Add Questions</a>
                  <a href="/api/test-plugin/delete-test/?documentId=${test.documentId}" onclick="return confirm('Sei sicuro di voler eliminare questa categoria?')">Elimina</a>
                </li>`
          )
          .join('');
      } catch (error) {
            return `<li>Errore nel caricamento delle categories: ${error.message}</li>`;
      }
    }

}