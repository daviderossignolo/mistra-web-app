export default [
	{
		method: "POST",
		path: "/create-category", // Questa rotta permette di creare una categoria
		handler: "category.createCategory", // Controller per creare una categoria
		config: {
			auth: { required: true },
		},
	},
	{
		method: "POST",
		path: "/modify-category", // Questa rotta permette di visualizzare una categoria
		handler: "category.modifyCategory", // Controller per visualizzare una categoria
		config: {
			auth: { required: true },
		},
	},

	{
		method: "POST",
		path: "/delete-category", // Questa rotta permette di eliminare una categoria
		handler: "category.deleteCategory", // Controller per eliminare una categoria
		config: {
			auth: { required: true },
		},
	},
	{
		method: "GET",
		path: "/get-categories", // Questa rotta permette di ottenere tutte le categorie
		handler: "category.getCategories", // Controller per ottenere tutte le categorie
		config: {
			auth: { required: true },
		},
	},
];
