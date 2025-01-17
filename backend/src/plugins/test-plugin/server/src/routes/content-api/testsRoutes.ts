export default [
    {
        method: 'GET',
        path: '/display-test', // Questa rotta genera un test casuale
        handler: 'tests.testManagement', // Aggiungi il controller per ottenere il test
        config: {
            auth: false, // Nessuna autenticazione per il test
        },
    },	
    {	
        method: 'POST',
        path: '/create-test', // Questa rotta genera un test casuale
        handler: 'tests.createTest', // Aggiungi il controller per ottenere il test
        config: {
            auth: false, // Nessuna autenticazione per il test
        },
    },
    {
        method: 'GET',
        path: '/modify-Test', // Questa rotta genera un test casuale
        handler: 'tests.modifyTest', // Aggiungi il controller per ottenere il test
        config: {
              auth: false, // Nessuna autenticazione per il test
        },
    },
    {
        method: 'POST',
        path: '/submit-modify-test',
        handler: 'tests.submitModifyTest',
        config: {
              auth: false, // Nessuna autenticazione per il test
        },
    },
    {
        method: 'GET',
        path: '/delete-test',
        handler: 'tests.deleteTest',
        config: {
              auth: false, // Nessuna autenticazione per il test
        },
    },
    {
        method: 'GET',
        path: '/add-question-to-test',
        handler: 'tests.addQuestionToTest',
        config: {
              auth: false, // Nessuna autenticazione per il test
        },
    },
    {
        method: 'POST',
        path: '/create-QuestionInTest',
        handler: 'tests.createQuestionInTest',
        config: {
              auth: false, // Nessuna autenticazione per il test
        },
    },
]