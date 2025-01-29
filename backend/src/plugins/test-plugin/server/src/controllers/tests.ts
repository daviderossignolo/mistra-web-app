import type { Context } from 'koa';
const { v4: uuidv4 } = require('uuid');
import testsService from '../services/tests';
import questionService from '../services/question';
import axios from 'axios'; // Assicurati di avere axios installato con `yarn add axios`
import { cp } from 'fs';


interface Quiz {
    id: string;
    name: string;
    description: string;
    questions: {
        id: string;
        name:string;
        text: string;
        category: {
            id_category: string;
            name: string;
        };
        answers: {
            id: string;
            text: string;
            correction: boolean;
            score: number;
        }[];
    }[];
}

export default {

    async createTest(ctx: Context) {
        try {
            const { id_test, name_test, description_test } = ctx.request.body;
            console.log(ctx.request.body);
            
            // Struttura il payload correttamente
            const payload = {
                data: {
                    id_test,
                    name_test,
                    description_test,
                }
            };

            console.log("Sto per mandare:", payload);
            
            // Creazione del Test con i dati forniti
            const response = await axios.post('http://localhost:1337/api/tests', payload);

            return response;
            
            // Pagina di conferma
            ctx.body = `
            <!DOCTYPE html>
            <html lang="en">
            	<head>
                	<meta charset="UTF-8">
					<meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-test">
					<title>Redirect</title>
					<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            	</head>
            	<body class="bg-gray-100 flex items-center justify-center min-h-screen">
                	<div class="bg-white p-8 rounded-lg shadow-lg text-center">
						<h1 class="text-2xl font-semibold text-green-600 mb-4">Question creata con successo</h1>
						<p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
					</div>
            	</body>
            </html>`;
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
    },
    
    async testManagement(ctx: Context) {
        try {
            const getTestHTML = await testsService.getTestHTML();
            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Test Management</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 font-sans">
                        <div class="max-w-3xl mx-auto p-8">
                            <h1 class="text-3xl font-semibold text-gray-800 mb-6">Gestione Tests</h1>
                            <h2 class="text-xl font-medium text-gray-700 mb-4">Tests</h2>
                            <ul class="list-disc pl-8 mb-4">${getTestHTML}</ul>
                            <form method="POST" action="http://localhost:1337/api/test-plugin/create-test" enctype="application/json" class="bg-white p-6 rounded-lg shadow-lg">
        	    				<label for="name_test" class="block text-lg text-gray-800 mb-2">Name:</label>
        	    				<input type="text" name="name_test" id="name_test" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
        	    				<label for="description_test" class="block text-lg text-gray-800 mb-2">Descrizione:</label>
            	    			<textarea name="description_test" id="description_test" class="border border-gray-300 p-2 rounded-lg w-full mb-4"></textarea>
                                <button type="submit" class="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">Crea Test</button>
        	    			</form>
                            <a href="http://localhost:1337/api/test-plugin/search-test-Execution" class="text-blue-500 hover:underline mt-4 inline-block">Torna alla pagina principale</a>
                        </div>
                    </body>
                </html>`;
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
    },
    
    async modifyTest(ctx: Context) {
        try {
            const { documentId } = ctx.query;
            const response = await axios.get(`http://localhost:1337/api/tests/${documentId}?pLevel=3`);
            const data = response.data.data;
            

            // Filtro i dati
            const filteredData = {
                id: data.id ? data.id : null,
                documentId: data.documentId,
                id_test: data.id_test,
                name_test: data.name_test,
                description_test: data.description_test,
                question_in_tests: data.question_in_tests
                ? data.question_in_tests.map((question_in_tests) => ({
                    id: question_in_tests.id ? question_in_tests.id : null,
                    documentId: question_in_tests.documentId,
                    id_question: question_in_tests.id_question
                        ? {
                            id: question_in_tests.id_question.id ? question_in_tests.id_question.id : null,
                            documentId: question_in_tests.id_question.documentId,
                            id_question: question_in_tests.id_question.id_question,
                            name: question_in_tests.id_question.name,
                            text: question_in_tests.id_question.text
                        } : []
                  }))
                : [],
              };

            ctx.body = `
            <html>
                <head>
                    <title>Modifica Test</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                </head>
                <body class="bg-gray-100 font-sans">
                    <div class="max-w-3xl mx-auto p-8">
                        <h1 class="text-3xl font-semibold text-gray-800 mb-6">Modifica Test</h1>
                        <form action="http://localhost:1337/api/test-plugin/submit-modify-test/?documentId=${documentId}" method="POST" class="bg-white p-6 rounded-lg shadow-lg">
                            <label for="name_test" class="block text-lg text-gray-800 mb-2">Name:</label>
                            <input type="text" name="name_test" id="name_test" value="${data.name_test || ''}" required class="border border-gray-300 p-2 rounded-lg w-full mb-4" />
    
                            <label for="description_test" class="block text-lg text-gray-800 mb-2">Descrizione:</label>
                            <textarea name="description_test" id="description_test" required class="border border-gray-300 p-2 rounded-lg w-full mb-4">${data.description_test || ''}</textarea>
    
                            <button type="submit" class="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">Modifica Test</button>
                            <a href="http://localhost:1337/api/test-plugin/display-test" class="text-blue-500 hover:underline mt-4 inline-block">Torna alla visualizzazione dei Test</a>
                        </form>
                    </div>
                </body>
            </html>`;
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
    },
    
    async submitModifyTest(ctx: Context) {
        try {
            const { documentId } = ctx.query;
            const { name_test, description_test } = ctx.request.body;
            console.log(ctx.request.body)
            
            // Struttura il payload correttamente
            const payload = {
                data: {
                    name_test,
                    description_test,
                }
            };
            
            // Modifica il Test con i dati forniti
            await axios.put(`http://localhost:1337/api/tests/${documentId}`, payload);
            
            // Pagina di conferma
            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-test">
                        <title>Redirect</title>					
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                        <div class="bg-white p-8 rounded-lg shadow-lg text-center">
                            <h1 class="text-2xl font-semibold text-green-600 mb-4">Test modificato con successo</h1>
                            <p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
                        </div>
                    </body>
                </html>`;
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async deleteTest(ctx: Context) {
        try {
            const { documentId } = ctx.query;
            
            // Elimina il Test con l'id fornito
            await axios.delete(`http://localhost:1337/api/tests/${documentId}`);
            
            // Pagina di conferma
            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/display-test">
                        <title>Redirect</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                        <div class="bg-white p-8 rounded-lg shadow-lg text-center">
                            <h1 class="text-2xl font-semibold text-red-600 mb-4">Test eliminato con successo</h1>
                            <p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
                        </div>
                    </body>
                </html>`;
            ctx.type = 'html';
        }
        catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async getTests(){
        try {
            const tests = await axios.get('http://localhost:1337/api/tests?pLevel=3');
            const filteredTests = tests.data.data.map(data => ({
                id: data.id ? data.id : null,
                documentId: data.documentId,
                id_test: data.id_test,
                name_test: data.name_test,
                description_test: data.description_test,
                question_in_tests: data.question_in_tests
                ? data.question_in_tests.map((question_in_tests) => ({
                    id: question_in_tests.id ? question_in_tests.id : null,
                    documentId: question_in_tests.documentId,
                    id_question: question_in_tests.id_question
                        ? {
                            id: question_in_tests.id_question.id ? question_in_tests.id_question.id : null,
                            documentId: question_in_tests.id_question.documentId,
                            id_question: question_in_tests.id_question.id_question,
                            name: question_in_tests.id_question.name,
                            text: question_in_tests.id_question.text
                        } : []
                  }))
                : []
            }));

            console.log(filteredTests)
            return filteredTests
        } catch (error) {
            return `<li>Errore nel caricamento delle categories: ${error.message}</li>`;
        }
        
    },

    async addQuestionToTest(ctx: Context) {
        try {
            const { documentId } = ctx.query;
    
            const getQuestionHTML = await questionService.getQuestionsHTML();
            const response = await axios.get(`http://localhost:1337/api/tests/${documentId}?populate=*`);
            
            const data = response.data.data;
    
            ctx.body = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Test Management</title>
                        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
                            <h1 class="text-3xl font-bold mb-6 text-center">Add Question to Test</h1>
                            
                            <div class="mb-6">
                                <h2 class="text-2xl font-semibold">Questions</h2>
                                <ul class="list-disc pl-6 space-y-2">
                                    ${getQuestionHTML}
                                </ul>
                            </div>
                            
                            <div class="mb-6">
                                <h2 class="text-2xl font-semibold">Test Details</h2>
                                <p class="text-gray-700"><strong>ID:</strong> ${data.id_test || ''}</p>
                                <p class="text-gray-700"><strong>Name:</strong> ${data.name_test || ''}</p>
                                <p class="text-gray-700"><strong>Description:</strong> ${data.description_test || ''}</p>
                            </div>
                            
                            <form 
                                method="POST" 
                                action="http://localhost:1337/api/test-plugin/create-QuestionInTest/?id_test=${documentId}" 
                                enctype="application/json" 
                                class="space-y-4"
                            >
                                <div>
                                    <label for="id_question" class="block text-sm font-medium text-gray-700">Question:</label>
                                    <input 
                                        type="text" 
                                        name="id_question" 
                                        id="id_question" 
                                        required 
                                        class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    >
                                </div>
                                <button 
                                    type="submit" 
                                    class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                                >
                                    Add Question
                                </button>
                            </form>
                            
                            <a 
                                href="http://localhost:1337/api/test-plugin/search-test-Execution" 
                                class="text-blue-500 hover:underline block mt-4 text-center"
                            >
                                Torna alla visualizzazione dei test
                            </a>
                        </div>
                    </body>
                </html>
            `;
            ctx.type = 'html';
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },            

    async createQuestionInTest(ctx: Context) {
        try {
            const id_test = ctx.query.id_test;
            const { id_question } = ctx.request.body;
            console.log(ctx.request.body);

            const payload = {
                data: {
                    id_question,
                    id_test
                }
            };

            console.log(payload);

            await axios.post('http://localhost:1337/api/question-in-tests', payload);

            // Pagina di conferma
            ctx.body = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="refresh" content="2;url=http://localhost:1337/api/test-plugin/add-question-to-test/?documentId=${id_test}">
                    <title>Redirect</title>						
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            	</head>
            	<body class="bg-gray-100 flex items-center justify-center min-h-screen">
                	<div class="bg-white p-8 rounded-lg shadow-lg text-center">
						<h1 class="text-2xl font-semibold text-green-600 mb-4">Question aggiunta al test con successo</h1>
						<p class="text-lg text-gray-700">Stai per essere reindirizzato...</p>
					</div>
            	</body>
            </html>`;
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async deleteQuestionInTest(ctx: Context) {
        try {
            const id_test = ctx.query.id_test;
            const { id_question } = ctx.request.body;
    
            // Recupera tutte le question_in_tests dall'API
            const response = await axios.get("http://localhost:1337/api/question-in-tests/?pLevel=3");
    
            const QuestionInTest = response.data.data;

            console.log(QuestionInTest);

            const targetQuestionInTest = QuestionInTest.filter(
                (question_in_tests) => question_in_tests.id_question.documentId === id_question 
                                        && question_in_tests.id_test.documentId === id_test
            );
            console.log("Valore filtrato");
            console.log(targetQuestionInTest);
            console.log(targetQuestionInTest[0].documentId);
    
            await axios.delete(`http://localhost:1337/api/question-in-tests/${targetQuestionInTest[0].documentId}`)
            
            // Se trovi un elemento, restituisci le informazioni o elimina
            ctx.body = { data: targetQuestionInTest };
    
        } catch (error) {
            ctx.body = { error: error.message };
        }
    },

    async createCompleteTest(ctx: Context) {
        try {
            const { id, name, description, questions } = ctx.request.body as Quiz;
    
            console.log("Dati ricevuti:", ctx.request.body);
    
            let testId = id || uuidv4();
    
            // Recupera tutti i test e filtra localmente
            const allTests = await axios.get('http://localhost:1337/api/tests')
                .then(res => res.data.data)
                .catch(() => []);

            console.log("allTests", allTests);
    
            const existingTest = allTests.filter((test) => {
                return test.id_test === testId;
            });

            console.log("payload", {
                id_test: testId,
                name_test: name,
                description_test: description,
            });

            console.log("existingTest", existingTest);
    
            if (existingTest.length === 0) {
                // Crea il test solo se non esiste
                console.log("Creo il test perchè non esiste");
                const testResponse = await axios.post('http://localhost:1337/api/test-plugin/create-test', {
                    id_test: testId,
                    name_test: name,
                    description_test: description,
                });
                testId = testResponse.data.data.data.documentId;
            }
    
            // Recupera tutte le domande
            const allQuestions = await axios.get('http://localhost:1337/api/questions')
            .then(res => res.data.data)
            .catch(() => []);

            console.log("allQuestions", allQuestions);

            for (const question of questions) {
                let questionId = question.id || uuidv4();
                
                // Filtra localmente per vedere se la domanda esiste già
                const existingQuestion = allQuestions.filter((question) => {
                    return question.id_question === questionId;
                });

                console.log("existingQuestion", existingQuestion);
                
                let createdAnswers = [];
                
                // Se la domanda non esiste, prima creiamo le risposte
                if (existingQuestion.length === 0) {
                    for (const answer of question.answers) {
                        let answerId = answer.id || uuidv4();

                        console.log("payload Answer", 
                        {
                            id: answerId,
                            text: answer.text,
                            score: answer.score,
                            correction: answer.correction,
                        });
                    
                        // Creiamo la risposta e la memorizziamo
                        const answerResponse = await axios.post('http://localhost:1337/api/test-plugin/create-answer', {
                                id_answer: answerId,
                                text: answer.text,
                                score: answer.score,
                                correction: answer.correction,
                        });
                        console.log("risposta answer", answerResponse.data.data);
                        console.log("DocumentID: ", answerResponse.data.data.data.documentId)
                        createdAnswers.push(answerResponse.data.data.data.documentId);
                    }

                    console.log("createdAnswers", createdAnswers);
                
                    // Dopo aver creato le risposte, creiamo la domanda e le associamo
                    const responseQuestion = await axios.post('http://localhost:1337/api/test-plugin/create-question', {
                            id_question: questionId,
                            name: question.name,
                            text: question.text,
                            category: {
                                id: question.category.id_category,
                                name: question.category.name
                            },
                            answer: createdAnswers.join(','),
                    });
                    questionId = responseQuestion.data.data.data.documentId
                    console.log("documentId question", questionId);

                }
                else {
                    questionId = existingQuestion[0].documentId;
                }

                //Creo question in test
                await axios.post(`http://localhost:1337/api/test-plugin/create-QuestionInTest?id_test=${testId}`, {
                    id_question: questionId,
                }
            )}
    
            console.log("Test creato con successo");
            ctx.body = { message: "Test creato con successo" };
            ctx.status = 200;
        }
        catch (error) {
            ctx.body = { error: error.message };
            ctx.status = 500;
        }
    }    

}