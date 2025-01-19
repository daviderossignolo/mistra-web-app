export default [
    {
      	method: 'GET',
      	path: '/search-test', // Questa rotta genera un test casuale
      	handler: 'testExecution.searchTestExecution', // Aggiungi il controller per ottenere il test
      	config: {
      		auth: false, // Nessuna autenticazione per il test
      	},
    },
	{
		method: 'GET',
		path: '/search-by-id',
		handler: 'testExecution.searchById',
	  },	
]