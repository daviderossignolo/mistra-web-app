export default [
	{
		method: "POST",
		path: "/create-question", // Questa rotta permette creare una domanda
		handler: "question.createQuestion", // Controller per creare una domanda
		config: {
			auth: { required: true },
		},
	},
	{
		method: "POST",
		path: "/modify-question", // Questa rotta permette visualizzare una domanda
		handler: "question.modifyQuestion", // Controller per visualizzare una domanda
		config: {
			auth: { required: true },
		},
	},
	{
		method: "POST",
		path: "/delete-question-in-test", // Questa rotta permette eliminare una domanda presente in un test
		handler: "question.deleteQuestionInTest", // Controller per eliminare una domanda in un test
		config: {
			auth: { required: true },
		},
	},
	{
		method: "POST",
		path: "/delete-all-question-in-test", // Questa rotta permette eliminare una domanda presente in un test
		handler: "question.deleteAllQuestionInTest", // Controller per eliminare una domanda in un test
		config: {
			auth: { required: true },
		},
	},
	{
		method: "GET",
		path: "/get-questions", // Questa rotta permette ottenere tutte le domande
		handler: "question.getQuestions", // Controller per ottenere tutte le domande
		config: {
			auth: { required: true },
		},
	},
	{
		method: "POST",
		path: "/delete-question-model",
		handler: "question.deleteQuestionModel",
		config: {
			auth: { required: true },
		},
	},
	{
		method: "POST",
		path: "/get-complete-question",
		handler: "question.getCompleteQuestion",
		config: {
			auth: { required: true },
		},
	},
];
