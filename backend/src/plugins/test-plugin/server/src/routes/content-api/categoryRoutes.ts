export default [
    {
      	method: 'POST',
      	path: '/create-category', // Questa rotta genera un test casuale
      	handler: 'category.createCategory', // Aggiungi il controller per ottenere il test
      	config: {
      	  	auth: false, // Nessuna autenticazione per il test
      	},
    },
    {
      	method: 'GET',
      	path: '/modify-category', // Questa rotta genera un test casuale
      	handler: 'category.modifyCategory', // Aggiungi il controller per ottenere il test
      	config: {
      	  	auth: false, // Nessuna autenticazione per il test
      	},
    },
    {
      	method: 'POST',
      	path: '/submit-modify-category',
      	handler: 'category.submitModifyCategory',
      	config: {
      	  	auth: false, // Nessuna autenticazione per il test
      	},
    },
    {
      	method: 'GET',
      	path: '/delete-category',
      	handler: 'category.deleteCategory',
      	config: {
      	  	auth: false, // Nessuna autenticazione per il test
      	},
    },
	{
        method: 'GET',
        path: '/get-categories', // Questa rotta genera un test casuale
        handler: 'category.getCategories', // Aggiungi il controller per ottenere il test
        config: {
        	auth: false, // Nessuna autenticazione per il test
        },
    },
]