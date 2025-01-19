import axios from 'axios';

export default {
	async getCategoriesHTML() {
    	try {
      		const response = await axios.get('http://localhost:1337/api/categories');
      		return response.data.data
        	.map(
          		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
          		(category: any) => `
          		<li>
            		<strong>ID:</strong> ${category.documentId}, 
            		<strong>Name:</strong> ${category.name}
            		<a href="/api/test-plugin/modify-category/?documentId=${category.documentId}" class="text-blue-500 hover:underline mt-4 inline-block">Modifica</a>
            		<a href="/api/test-plugin/delete-category/?documentId=${category.documentId}" onclick="return confirm('Sei sicuro di voler eliminare questa categoria?')" class="text-blue-500 hover:underline mt-4 inline-block">Elimina</a>
          		</li>`
        	)
        	.join('');
    	} catch (error) {
      		return `<li>Errore nel caricamento delle categories: ${error.message}</li>`;
    	}
  	},
};
