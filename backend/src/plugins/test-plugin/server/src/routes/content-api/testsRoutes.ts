export default [
	{
		method: "POST",
		path: "/create-test", // Questa rotta genera un test casuale
		handler: "tests.createTest", // Aggiungi il controller per ottenere il test
		config: {
			auth: false, // Nessuna autenticazione per il test
		},
	},
	{
		method: "POST",
		path: "/submit-modify-test",
		handler: "tests.submitModifyTest",
		config: {
			auth: false, // Nessuna autenticazione per il test
		},
	},
	{
		method: "POST",
		path: "/delete-test",
		handler: "tests.deleteTest",
		config: {
			auth: false, // Nessuna autenticazione per il test
		},
	},
	{
		method: "POST",
		path: "/get-complete-test",
		handler: "tests.getCompleteTest",
		config: {
			auth: false, // Nessuna autenticazione per il test
		},
	},
];
