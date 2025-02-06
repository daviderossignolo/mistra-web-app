import type { Context } from "koa";
const { v4: uuidv4 } = require("uuid");
import axios from "axios";
import testService from "../services/testExecution";
import test from "node:test";
import question from "./question";

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

type TestExecution = {
	test_info: {
		documentId: string;
		test_name: string;
		test_description: string;
		score: number;
		execution_time: string;
		revision_date: string;
		note: string;
		user_info: {
			age: number;
			sex: string;
			ip: string;
		};
	};
	questions: {
		category_name: string;
		question_name: string;
		question_text: string;
		answers: {
			documentId: string;
			answer_text: string;
			answer_correction: string;
			user_selected: boolean;
		}[];
	}[];
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

		const token = process.env.SERVICE_KEY;

		// Recupera tutti i test
		const testResponse = await fetch(
			`http://${host}:${port}/api/tests?pLevel`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
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
					"Authorization": `Bearer ${token}`,
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
						"Authorization": `Bearer ${token}`,
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
						"Authorization": `Bearer ${token}`,
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

		const token = process.env.SERVICE_KEY;

		// inserisco il test eseguito
		const testExecutionResponse = await fetch(
			`http://${host}:${port}/api/test-executions`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
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
						"Authorization": `Bearer ${token}`,
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

	/**
	 * Funzione che ritorna un test eseguito.
	 * @param ctx
	 */
	async getTestExecution(ctx: Context) {
		console.log("getTestExecution");
		const host = process.env.HOST;
		const port = process.env.PORT;

		const token = process.env.SERVICE_KEY;

		// Recupero il body della richiesta
		const body = ctx.request.body;
		const documentId = body.execDocId;

		// Definisco la struttura dati che rappresenta il test eseguito
		const toReturn: TestExecution = {
			test_info: {
				documentId: "",
				test_name: "",
				test_description: "",
				score: 0,
				execution_time: "",
				revision_date: "",
				note: "",
				user_info: {
					age: 0,
					sex: "",
					ip: "",
				},
			},
			questions: [],
		};

		// Recupero le informazioni riguardo al test eseguito
		const testExecutionResponse = await fetch(
			`http://${host}:${port}/api/test-executions?filters[documentId][$eq]=${documentId}&pLevel`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			},
		);

		if (!testExecutionResponse.ok) {
			ctx.status = testExecutionResponse.status;
			ctx.body = "Errore nel recupero del test eseguito";
			return ctx;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const testExecutionData = (await testExecutionResponse.json()) as any;

		// Setto le informazioni riguardo al test eseguito
		toReturn.test_info.documentId = testExecutionData.data[0].documentId;
		toReturn.test_info.execution_time =
			testExecutionData.data[0].execution_time;
		toReturn.test_info.note = testExecutionData.data[0].note;
		toReturn.test_info.revision_date = testExecutionData.data[0].revision_date;
		toReturn.test_info.score = testExecutionData.data[0].score;
		toReturn.test_info.test_name = testExecutionData.data[0].id_test.name_test;
		toReturn.test_info.test_description =
			testExecutionData.data[0].id_test.description_test;

		// Setto le informazioni riguardo all'utente
		toReturn.test_info.user_info.age = testExecutionData.data[0].age;
		toReturn.test_info.user_info.ip = testExecutionData.data[0].ip;
		toReturn.test_info.user_info.sex = testExecutionData.data[0].id_sex.name;

		// Recupero le domande di questo test
		const strapiTestId = testExecutionData.data[0].id_test.id;
		const questionsInTestResponse = await fetch(
			`http://${host}:${port}/api/question-in-tests?filters[test_id][$eq]=${strapiTestId}&pLevel`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`,
				},
			},
		);

		if (!questionsInTestResponse.ok) {
			ctx.status = questionsInTestResponse.status;
			ctx.body = "Errore nel recupero delle domande del test";
			return ctx;
		}

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const questionsInTestData = (await questionsInTestResponse.json()) as any;
		console.log(questionsInTestData.data[0].question_id);

		for (const row of questionsInTestData.data) {
			const question = row.question_id;

			// Recupero le risposte dalla domanda
			const answersResponse = await fetch(
				`http://${host}:${port}/api/answers?filters[question_id][$eq]=${question.id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`,
					},
				},
			);

			if (!answersResponse.ok) {
				ctx.status = answersResponse.status;
				ctx.body = "Errore nel recupero delle risposte";
				return ctx;
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const answersData = (await answersResponse.json()) as any;
			const answersList: {
				documentId: string;
				answer_text: string;
				answer_correction: string;
				user_selected: boolean;
			}[] = [];
			// Itero sulle risposte per costuire la struttura dati
			for (const row of answersData.data) {
				answersList.push({
					documentId: row.documentId,
					answer_text: row.text,
					answer_correction: row.correction,
					user_selected: false,
				});
			}

			// Recupero le risposte date
			const givenAnswersResponse = await fetch(
				`http://${host}:${port}/api/given-answers?filters[id_testExecution][$eq]=${testExecutionData.data[0].id}&pLevel`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`,
					},
				},
			);

			if (!givenAnswersResponse.ok) {
				ctx.status = givenAnswersResponse.status;
				ctx.body = "Errore nel recupero delle risposte date";
				return ctx;
			}

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const givenAnswersData = (await givenAnswersResponse.json()) as any;
			const givenAnswers = givenAnswersData.data;

			// Itero sulle risposte date per settare il campo user_selected
			for (const givenAnswer of givenAnswers) {
				// se la risposta è legata alla domanda corrente
				if (
					givenAnswer.id_answer.question_id.documentId === question.documentId
				) {
					// cerco la risposta data dall'utente
					const answerIndex = answersList.findIndex(
						(answer) => answer.documentId === givenAnswer.id_answer.documentId,
					);
					answersList[answerIndex].user_selected = true;
				}
			}

			// Inserisco i dati sulla domanda
			toReturn.questions.push({
				category_name: question.category_id.name,
				question_name: question.name,
				question_text: question.text,
				answers: answersList,
			});
		}

		ctx.status = 200;
		ctx.body = toReturn;
		return ctx;
	},
};
