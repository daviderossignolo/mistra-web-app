export default [
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
		path: "/insert-test-execution",
		handler: "testExecution.insertTest",
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
];
