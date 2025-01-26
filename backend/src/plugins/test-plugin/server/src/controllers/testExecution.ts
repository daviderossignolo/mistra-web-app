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

    async testExecution(ctx: Context) {
        try {
            // Recupera tutti i test
            const tests = await axios.get('http://localhost:1337/api/tests?pLevel=4');
            const entryTests = tests.data.data; // Array delle entry nella proprietà 'data'

            if (entryTests.length === 0) {
                console.log('Nessuna entry trovata.');
                return null;
            }

            // Genera un indice casuale
            const randomIndex = Math.floor(Math.random() * entryTests.length);
            const data = entryTests[randomIndex];

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
                                text: question_in_tests.id_question.text,
                                id_category: question_in_tests.id_question.id_category
                                    ? {
                                        id: question_in_tests.id_question.id_category.id,
                                        documentId: question_in_tests.id_question.id_category.documentId,
                                        id_category: question_in_tests.id_question.id_category.id_category,
                                        name: question_in_tests.id_question.id_category.name
                                    }
                                    : null,
                                answers: question_in_tests.id_question.answers
                                    ? question_in_tests.id_question.answers.map((answer) => ({
                                        id: answer.id,
                                        documentId: answer.documentId,
                                        id_answer: answer.id_answer,
                                        text: answer.text,
                                        score: answer.score,
                                        correction: answer.correction
                                    }))
                                    : []
                            }
                            : null
                    }))
                    : [],
            };
          
            console.log(filteredData);
          
            return filteredData;

        } catch (error) {
            console.error('Errore durante il recupero dei dati:', error);
            throw error;
        }
    },

    async getTestExecution(ctx: Context) {
        const { testExecutionId } = ctx.query;
    
        console.log(testExecutionId);
    
        const testExecution = await axios.get(`http://localhost:1337/api/test-executions/${testExecutionId}?pLevel=4`);
        const entryTestExecution = testExecution.data.data;

        console.log(entryTestExecution);
        console.log("______________________________________________________________________________________________");
    
        const filteredData = {
            id: entryTestExecution.id,
            documentId: entryTestExecution.documentId,
            id_textexecution: entryTestExecution.id_textexecution,
            execution_time: entryTestExecution.execution_time,
            age: entryTestExecution.age,
            score: entryTestExecution.score,
            IP: entryTestExecution.IP,
            revision_date: entryTestExecution.revision_date,
            note: entryTestExecution.note,
            test: entryTestExecution.test
                ? {
                    id: entryTestExecution.test.id,
                    documentId: entryTestExecution.test.documentId,
                    id_test: entryTestExecution.test.id_test,
                    name_test: entryTestExecution.test.name_test,
                    description_test: entryTestExecution.test.description_test,
                    question_in_tests: entryTestExecution.test.question_in_tests
                        ? entryTestExecution.test.question_in_tests.map((question) => ({
                            id: question.id,
                            documentId: question.documentId,
                            id_question: question.id_question
                                ? {
                                    id: question.id_question.id,
                                    documentId: question.id_question.documentId,
                                    id_question: question.id_question.id_question,
                                    name: question.id_question.name,
                                    text: question.id_question.text,
                                }
                                : null,
                            id_test: question.id_test
                                ? {
                                    id: question.id_test.id,
                                    documentId: question.id_test.documentId,
                                    id_test: question.id_test.id_test,
                                    name_test: question.id_test.name_test,
                                    description_test: question.id_test.description_test,
                                }
                                : null,
                        }))
                        : [],
                }
                : null,
            sex: entryTestExecution.sex
                ? {
                    id: entryTestExecution.sex.id,
                    documentId: entryTestExecution.sex.documentId,
                    sex_id: entryTestExecution.sex.sex_id,
                    name: entryTestExecution.sex.name,
                }
                : null,
            given_answers: entryTestExecution.given_answers
                ? entryTestExecution.given_answers.map((answer) => ({
                    id: answer.id,
                    documentId: answer.documentId,
                    id_answer: answer.id_answer
                        ? {
                            id: answer.id_answer.id,
                            documentId: answer.id_answer.documentId,
                            id_answer: answer.id_answer.id_answer,
                            text: answer.id_answer.text,
                            score: answer.id_answer.score,
                            correction: answer.id_answer.correction,
                            id_question: answer.id_answer.id_question
                                ? {
                                    id: answer.id_answer.id_question.id,
                                    documentId: answer.id_answer.id_question.documentId,
                                    id_question: answer.id_answer.id_question.id_question,
                                    name: answer.id_answer.id_question.name,
                                    text: answer.id_answer.id_question.text,
                                }
                                : null,
                        }
                        : null,
                    id_test_execution: answer.id_test_execution
                        ? {
                            id: answer.id_test_execution.id,
                            documentId: answer.id_test_execution.documentId,
                            id_textexecution: answer.id_test_execution.id_textexecution,
                            execution_time: answer.id_test_execution.execution_time,
                            age: answer.id_test_execution.age,
                            score: answer.id_test_execution.score,
                            IP: answer.id_test_execution.IP,
                            revision_date: answer.id_test_execution.revision_date,
                            note: answer.id_test_execution.note,
                        }
                        : null,
                }))
                : [],
        };
    
        console.log(filteredData);
        return filteredData;
    },
    

};
