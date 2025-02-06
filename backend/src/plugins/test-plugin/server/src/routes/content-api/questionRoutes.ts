export default [
    {	
      	method: 'POST',
      	path: '/create-question', // Questa rotta permette creare una domanda
      	handler: 'question.createQuestion', // Controller per creare una domanda
      	config: {
      		auth: { required: true },
      	},
    },
	{
		method: 'GET',
		path: '/modify-question', // Questa rotta permette visualizzare una domanda
		handler: 'question.modifyQuestion', // Controller per visualizzare una domanda
		config: {
			  auth: { required: true },
		},
	},
	{
		method: 'POST',
		path: '/submit-modify-question', // Questa rotta permette modificare una domanda
		handler: 'question.submitModifyQuestion', // Controller per modificare una domanda
		config: {
			  auth: { required: true },
		},
  	},
  	{
		method: 'POST',
		path: '/delete-question', // Questa rotta permette eliminare una domanda
		handler: 'question.deleteQuestion', // Controller per eliminare una domanda
		config: {
			  auth: { required: true },
		},
  	},
	  {
        method: 'GET',
        path: '/get-questions', // Questa rotta permette ottenere tutte le domande
        handler: 'question.getQuestions', // Controller per ottenere tutte le domande
        config: {
        	auth: { required: true },
        },
    },
]