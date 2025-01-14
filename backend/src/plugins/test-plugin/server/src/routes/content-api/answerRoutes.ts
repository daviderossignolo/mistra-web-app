export default [
    {
      	method: 'GET',
      	path: '/display-answer', // Questa rotta genera un test casuale
      	handler: 'answer.answerManagement', // Aggiungi il controller per ottenere il test
      	config: {
        	auth: false, // Nessuna autenticazione per il test
      	},
    },
    {
      	method: 'POST',
      	path: '/create-answer', // Questa rotta genera un test casuale
      	handler: 'answer.createAnswer', // Aggiungi il controller per ottenere il test
      	config: {
      	  	auth: false, // Nessuna autenticazione per il test
      	},
    },
	{
		method: 'GET',
		path: '/modify-answer', // Questa rotta genera un test casuale
		handler: 'answer.modifyAnswer', // Aggiungi il controller per ottenere il test
		config: {
			  auth: false, // Nessuna autenticazione per il test
		},
  	},
	{
		method: 'POST',
		path: '/submit-modify-answer',
		handler: 'answer.submitModifyAnswer',
		config: {
			  auth: false, // Nessuna autenticazione per il test
		},
  	},
  	{
		method: 'GET',
		path: '/delete-answer',
		handler: 'answer.deleteAnswer',
		config: {
			  auth: false, // Nessuna autenticazione per il test
		},
  	},
    {
        method: "GET",
        path: "/",
        handler: "controller.index",
        config: {
        	policies: [],
        },
    },
	
]