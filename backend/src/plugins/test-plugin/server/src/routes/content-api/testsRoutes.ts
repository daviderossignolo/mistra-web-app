export default [
	{
		method: "POST",
		path: "/submit-modify-test", // Questa rotta permette di visualizzare un test
		handler: "tests.submitModifyTest", // Controller per visualizzare un test
		config: {
			auth: { required: true },
		},
	},
	{
		method: "POST",
		path: "/delete-test", // Questa rotta permette di eliminare un test
		handler: "tests.deleteTest", // Controller per eliminare un test
		config: {
			auth: { required: true },
		},
	},
	{
		method: "POST",
		path: "/get-complete-test", // Questa rotta permette di ottenere un test completo
		handler: "tests.getCompleteTest", // Controller per ottenere un test completo
		config: {
			auth: { required: true },
		},
	},
	{
		method: "POST",
		path: "/create-test", // Questa rotta permette di creare un test
		handler: "tests.createTest", // Controller per creare un test
		config: {
			auth: { required: true },
		},
	},
];
