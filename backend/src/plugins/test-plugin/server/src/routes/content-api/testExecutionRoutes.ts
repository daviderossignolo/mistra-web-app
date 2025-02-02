export default [
	{
		method: "GET",
		path: "/search-test-Execution", // Questa rotta genera un test casuale
		handler: "testExecution.searchTestExecution", // Aggiungi il controller per ottenere il test
		config: {
			auth: false, // Nessuna autenticazione per il test
		},
	},
	{
		method: "GET",
		path: "/search-test-Execution-by-id",
		handler: "testExecution.searchById",
		config: {
			auth: false, // Nessuna autenticazione per il test
		},
	},
	{
		method: "GET",
		path: "/random-test",
		handler: "testExecution.getRandomTest",
		config: {
			auth: false, // Nessuna autenticazione per il test
		},
	},
	{
		method: "GET",
		path: "/get-test-execution",
		handler: "testExecution.getTestExecution",
		config: {
			auth: false, // Nessuna autenticazione per il test
		},
	},
	{
		method: "POST",
		path: "/insert-test-execution",
		handler: "testExecution.insertTest",
		config: {
			auth: false, // Nessuna autenticazione per il test
		},
	},
];
