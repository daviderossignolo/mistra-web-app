export default [
    {
      method: "GET",
      path: "/",
      handler: "controller.index",
      config: {
        policies: [],
      },
    },
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
      path: '/display-question', // Questa rotta genera un test casuale
      handler: 'question.questionManagement', // Aggiungi il controller per ottenere il test
      config: {
        auth: false, // Nessuna autenticazione per il test
      },
    },
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
      path: '/display-category', // Questa rotta genera un test casuale
      handler: 'category.categoryManagement', // Aggiungi il controller per ottenere il test
      config: {
        auth: false, // Nessuna autenticazione per il test
      },
    },
    {
      method: 'POST',
      path: '/create-category', // Questa rotta genera un test casuale
      handler: 'category.createCategory', // Aggiungi il controller per ottenere il test
      config: {
        auth: false, // Nessuna autenticazione per il test
      },
    },
  ];
  