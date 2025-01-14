export default [
    {
      	method: 'GET',
      	path: '/search-test', // Questa rotta genera un test casuale
      	handler: 'test.searchTest', // Aggiungi il controller per ottenere il test
      	config: {
      		auth: false, // Nessuna autenticazione per il test
      	},
    },	
    {	
      	method: 'GET',
      	path: '/display-test', // Questa rotta genera un test casuale
      	handler: 'test.displayTest', // Aggiungi il controller per ottenere il test
      	config: {
      		auth: false, // Nessuna autenticazione per il test
      	},
    },	
    {	
      	method: 'POST',
      	path: '/submit-test', // Questa rotta invia i risultati del test
      	handler: 'test.submitTest', // Aggiungi il controller per salvare i risultati
      	config: {
      		auth: false, // Nessuna autenticazione per inviare un test
      	},
    },
]