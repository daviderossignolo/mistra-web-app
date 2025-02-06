export default [
    {
      	method: 'POST',
      	path: '/create-answer', // Questa rotta permette di creare una risposta
      	handler: 'answer.createAnswer', // Controller per creare una risposta
      	config: {
      	  	auth: { required: true },
      	},
    },
	{
		method: 'GET',
		path: '/modify-answer', // Questa rotta permette di visualizzare una risposta
		handler: 'answer.modifyAnswer', // Controller per visualizzare una risposta
		config: {
			  auth: { required: true },
		},
  	},
	{
		method: 'POST',
		path: '/submit-modify-answer', // Questa rotta permette di modificare una risposta
		handler: 'answer.submitModifyAnswer', // Controller per modificare una risposta
		config: {
			  auth: { required: true },
		},
  	},
  	{
		method: 'GET',
		path: '/delete-answer', // Questa rotta permette di eliminare una risposta
		handler: 'answer.deleteAnswer', // Controller per eliminare una risposta
		config: {
			  auth: { required: true},
		},
  	},
	{
        method: 'GET',
        path: '/get-answers', // Questa rotta permette di ottenere tutte le risposte
        handler: 'answer.getAnswers', // Controller per ottenere tutte le risposte
        config: {
        	auth: { required: true },
        },
    },
	{
        method: 'GET',
        path: '/get-free-answers', // Questa rotta permette di ottenere le risposte libere
        handler: 'answer.getFreeAnswers', // Controller per ottenere le risposte libere
        config: {
        	auth: { required: true },
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