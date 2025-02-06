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
		path: "/search-test-Execution-by-id", // Questa rotta permette di cercare un testExecution per id
		handler: "testExecution.searchById", // Controller per cercare un testExecution per id
		config: {
			auth: { required: true },
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
		method: "POST",
		path: "/get-test-execution", // Questa rotta permette di ottenere un testExecution
		handler: "testExecution.getTestExecution", // Controller per ottenere un testExecution
		config: {
			auth: { required: true },
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
