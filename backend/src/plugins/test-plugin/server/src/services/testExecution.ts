import axios from 'axios';

export default {
    async getTestExecutionsHTML() {
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
                            <a href="http://localhost:1337/api/test-plugin/display-test/?documentId=${test.documentId}" class="text-blue-500 hover:underline mt-4 inline-block">Modifica</a>
                        </li>`
                )
                .join('');
        } catch (error) {
            return `<li>Errore nel caricamento dei test: ${error.message}</li>`;
        }
    },

    async getTestExecutionById(testId: string) {
        try {
            const response = await axios.get(`http://localhost:1337/api/test-executions/${testId}`);
            const test = response.data.data;
            return `
                <li>
                    <strong>ID:</strong> ${test.id}, 
                    <strong>documentId:</strong> ${test.documentId}, 
                    <strong>Age:</strong> ${test.age}, 
                    <strong>Score:</strong> ${test.score}
                </li>`;
        } catch (error) {
            return `<li>Errore nel caricamento del test con ID ${testId}: ${error.message}</li>`;
        }
    }
}
