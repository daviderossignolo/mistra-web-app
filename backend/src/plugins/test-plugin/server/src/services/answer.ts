import axios from 'axios';

export default {
    async getAnswersHTML() {
        try{
            const response = await axios.get('http://localhost:1337/api/answers');
            return response.data.data
            .map(
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (answer: any) => `
                <li>
                    <strong>ID:</strong> ${answer.documentId} 
                    <strong>Text:</strong> ${answer.text}
                    <strong>Score:</strong> ${answer.score}
                    <strong>Correction:</strong> ${answer.correction}
                    <a href="/api/test-plugin/modify-answer/?documentId=${answer.documentId}">Modifica</a>
                    <a href="/api/test-plugin/delete-answer/?documentId=${answer.documentId}" onclick="return confirm('Sei sicuro di voler eliminare questa answer?')">Elimina</a>
                </li>`
            )
        } catch (error) {
            return `<li>Errore nel caricamento delle answers: ${error.message}</li>`;
        }
    },
};