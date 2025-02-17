import axios from 'axios';

export default {

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
                	`<li>
                        <strong>ID:</strong> ${answer.documentId} 
                        <strong>Text:</strong> ${answer.text}
                        <strong>Score:</strong> ${answer.score}
                        <a href="/api/test-plugin/modify-answer/?documentId=${answer.documentId}" class="text-blue-500 hover:underline mt-4 inline-block">Modifica</a>
                        <a href="/api/test-plugin/delete-answer/?documentId=${answer.documentId}" onclick="return confirm('Sei sicuro di voler eliminare questa answer?')" class="text-blue-500 hover:underline mt-4 inline-block">Elimina</a>
                    </li>`
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
                .map((question: { documentId: string, id_question: string; name: string; text: string; answers: { id_answer: string; text: string; score: number; }[], id_category: { id_category: string, name: string}; }) => {
                    const answersHTML = question.answers
                        .map(
                            (answer: { id_answer: string; text: string; score: number; }) =>
                                `<li><strong>ID:</strong> ${answer.id_answer}, <strong>Text:</strong> ${answer.text}, <strong>Score:</strong> ${answer.score}</li>`
                        )
                        .join('');

                    const categoryName = question.id_category ? question.id_category.name : 'Nessuna categoria';
                    
                    return `
                        <ul>
                            <li>
                                <strong>documentId:</strong> ${question.documentId}
                                <br>
                                <strong>Question ID:</strong> ${question.id_question}
                                <br>
                                <strong>Name:</strong> ${question.name}
                                <br>
                                <strong>Text:</strong> ${question.text}
                                <br>
                                <strong>Category:</strong> ${categoryName}
                                <br>
                                <strong>Answers:</strong>
                                <ul>${answersHTML}</ul>
                                <a href="/api/test-plugin/modify-question/?documentId=${question.documentId}" class="text-blue-500 hover:underline mt-4 inline-block">Modifica</a>
                                <a href="/api/test-plugin/delete-question/?documentId=${question.documentId}" onclick="return confirm('Sei sicuro di voler eliminare questa question?')" class="text-blue-500 hover:underline mt-4 inline-block">Elimina</a>
                            </li>
                        </ul>`;
                })
                .join('');
        } catch (error) {
            return `<li>Errore nel caricamento delle questions: ${error.message}</li>`;
        }
    }

};