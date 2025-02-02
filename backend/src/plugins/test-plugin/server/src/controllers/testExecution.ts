import type { Context } from "koa";
const { v4: uuidv4 } = require("uuid");
import axios from "axios";
import testService from "../services/testExecution";

// Tipi TypeScript
export type Answer = {
	id: string;
	documentId: string;
	text: string;
	correction: string;
	score: number;
};

export type Question = {
	id: string;
	documentId: string;
	name: string;
	text: string;
	category: Category;
	answers: {
		id: string;
		text: string;
		correction: string;
		score: number;
	}[];
};

export type Category = {
	id_category: string;
	name: string;
};

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
		ctx.type = "html";
	},

	async searchById(ctx: Context) {
		try {
			const { testId } = ctx.query;

			if (!testId) {
				ctx.body = "<p>Errore: ID non fornito</p>";
				ctx.type = "html";
				return;
			}

			const testExecutionHTML = await testService.getTestExecutionById(
				testId as string,
			);
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
			ctx.type = "html";
		} catch (error) {
			ctx.body = `<p>Errore: ${error.message}</p>`;
			ctx.type = "html";
		}
	},

	/**
	 * Return a random test from the database
	 * @param ctx
	 * @returns
	 */
	async getRandomTest(ctx: Context) {
		const host = process.env.HOST;
		const port = process.env.PORT;
		// Recupera tutti i test
		const testResponse = await fetch(
			`http://${host}:${port}/api/tests?pLevel`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		// Se ho errore faccio il throw di un errore
		if (!testResponse.ok) {
			throw new Error(
				`Errore nel recupero dei test - status: ${testResponse.status}`,
			);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const tests = (await testResponse.json()) as any;
		const entryTests = tests.data;

		if (entryTests.length === 0) {
			console.log("Nessuna entry trovata.");
			return null;
		}

		// Genera un indice casuale
		const randomIndex = Math.floor(Math.random() * entryTests.length);
		const data = entryTests[randomIndex];

		// Struttura dati del quiz
		const quizData = {
			id: data.id_test,
			documentId: data.documentId,
			name: data.name_test,
			description: data.description_test,
			questions: [],
		};

		// Recupera tutte le domande appartenti al test
		const questionsInTestResponse = await fetch(
			`http://${host}:${port}/api/question-in-tests?filters[test_id][$eq]=${data.id}&populate=*`,
			{
				method: "GET",

				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		// Errore
		if (!questionsInTestResponse.ok) {
			throw new Error(
				`Errore nel recupero delle domande del test - status: ${questionsInTestResponse.status}`,
			);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const questionInTest = (await questionsInTestResponse.json()) as any;
		const questionInTestData = questionInTest.data;

		for (const row of questionInTestData) {
			// recupero la domanda dal db usando il document id
			const questionResponse = await fetch(
				`http://${host}:${port}/api/questions/${row.question_id.documentId}?pLevel=4`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!questionResponse.ok) {
				throw new Error(
					`Errore nel recupero della domanda - status: ${questionResponse.status}`,
				);
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const questionData = (await questionResponse.json()) as any;
			const question = questionData.data;

			// recupero tutte le risposte legate alla domanda corrente
			const answersResponse = await fetch(
				`http://localhost:1337/api/answers?filters[question_id][$eq]=${question.id}&populate=*`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!answersResponse.ok) {
				throw new Error(
					`Errore nel recupero delle risposte - status: ${answersResponse.status}`,
				);
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const answersData = (await answersResponse.json()) as any;
			const answers = answersData.data;

			const answersList: Answer[] = [];
			for (const answer of answers) {
				answersList.push({
					id: answer.id_answer,
					documentId: answer.documentId,
					text: answer.text,
					correction: answer.correction,
					score: answer.score,
				});
			}

			// costruisco un oggetto che verrà inserito nel quizData
			const questionObj: Question = {
				id: question.id_question,
				documentId: question.documentId,
				name: question.name,
				text: question.text,
				category: {
					id_category: question.category_id.id_category,
					name: question.category_id.name,
				},
				answers: answersList,
			};

			quizData.questions.push(questionObj);
		}

		ctx.status = 200;
		ctx.body = quizData;

		return quizData;
	},

	/**
	 * Insert a test execution in the database
	 * @param ctx
	 * @returns
	 */
	async insertTest(ctx: Context) {
		const host = process.env.HOST;
		const port = process.env.PORT;
		const body = ctx.request.body;

		// inserisco il test eseguito
		const testExecutionResponse = await fetch(
			`http://${host}:${port}/api/test-executions`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					data: {
						test_execution_id: body.id,
						age: body.age,
						score: body.score,
						ip: body.ip,
						execution_time: body.execution_time,
						id_test: body.id_test,
						id_sex: body.id_sex,
					},
				}),
			},
		);

		if (!testExecutionResponse.ok) {
			throw new Error(
				`Errore nell'inserimento del test eseguito - status: ${testExecutionResponse.status}`,
			);
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const testExecutionData = (await testExecutionResponse.json()) as any;
		const docId = testExecutionData.data.documentId;

		// inserisco le risposte date
		for (const answer of body.answers) {
			const givenAnswersResponse = await fetch(
				`http://${host}:${port}/api/given-answers`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						data: {
							id_testExecution: docId,
							id_answer: answer,
						},
					}),
				},
			);

			if (!givenAnswersResponse.ok) {
				throw new Error(
					`Errore nell'inserimento delle risposte date - status: ${givenAnswersResponse.status}`,
				);
			}
		}

		ctx.status = 200;
		ctx.body = "Test eseguito inserito correttamente";
		return ctx;
	},

	async getTestExecution(ctx: Context) {
		const { testExecutionId } = ctx.query;

		console.log(testExecutionId);

		const testExecution = await axios.get(
			`http://localhost:1337/api/test-executions/${testExecutionId}?pLevel=4`,
		);
		const entryTestExecution = testExecution.data.data;

		console.log(entryTestExecution);
		console.log(
			"______________________________________________________________________________________________",
		);

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
