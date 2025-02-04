export default [
    {	
      	method: 'POST',
      	path: '/create-question', // Questa rotta genera un test casuale
      	handler: 'question.createQuestion', // Aggiungi il controller per ottenere il test
      	config: {
      		auth: false, // Nessuna autenticazione per il test
      	},
    },
	{
		method: 'GET',
		path: '/modify-question', // Questa rotta genera un test casuale
		handler: 'question.modifyQuestion', // Aggiungi il controller per ottenere il test
		config: {
			  auth: false, // Nessuna autenticazione per il test
		},
  	},
	{
		method: 'POST',
		path: '/submit-modify-question',
		handler: 'question.submitModifyQuestion',
		config: {
			  auth: false, // Nessuna autenticazione per il test
		},
  	},
  	{
		method: 'GET',
		path: '/delete-question',
		handler: 'question.deleteQuestion',
		config: {
			  auth: false, // Nessuna autenticazione per il test
		},
  	},
	  {
        method: 'GET',
        path: '/get-questions', // Questa rotta genera un test casuale
        handler: 'question.getQuestions', // Aggiungi il controller per ottenere il test
        config: {
        	auth: false, // Nessuna autenticazione per il test
        },
    },
]