import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Category } from "./QuestionModal";

interface CategoryModalProps {
	category: Category;
	edit?: boolean;
	onClose: () => void;
	onSave: (category: Category) => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
	category,
	edit,
	onClose,
	onSave,
}) => {
	const [categoryName, setCategoryName] = useState<string>("");

	useEffect(() => {
		if (edit && category) {
			setCategoryName(category.name);
		}
	}, [edit, category]);

	const handleSave = async () => {
		if (!categoryName || categoryName.trim() === "") {
			alert("Il nome della categoria non può essere vuoto.");
			return;
		}

		try {
			const name = categoryName.trim();
			const token = localStorage.getItem("token");

			if (edit) {
				// Aggiornamento della categoria esistente
				const response = await fetch(
					"http://localhost:1337/api/test-plugin/modify-category",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							documentId: category.documentId,
							name: name,
						}),
					},
				);

				if (!response.ok) {
					throw new Error("Errore durante l'aggiornamento della categoria");
				}

				onSave({ ...category, name });
			} else {
				// Creazione di una nuova categoria
				const category_id = uuidv4();
				const response = await fetch(
					"http://localhost:1337/api/test-plugin/create-category",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ id_category: category_id, name: name }),
					},
				);

				if (!response.ok) {
					throw new Error("Errore durante il salvataggio della categoria");
				}

				onSave({ name, documentId: "", id_category: category_id });
			}

			onClose();
		} catch (error) {
			alert(
				"Si è verificato un errore durante il salvataggio della categoria.",
			);
			console.error(error);
		}
	};

	return (
		<div
			className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center font-accesible-font text-navbar-hover"
			aria-modal="true"
			// biome-ignore lint/a11y/useSemanticElements: <explanation>
			role="dialog"
			aria-labelledby="categoryModalHeading"
		>
			<div
				className="bg-white w-11/12 max-w-md p-4 rounded shadow-lg"
				aria-labelledby="categoryModalHeading"
			>
				<div className="w-full bg-navbar-hover px-4 py-4 mb-4">
					<h3
						id="categoryModalHeading"
						className="font-bold text-center text-white"
					>
						{edit ? "Modifica Categoria" : "Nuova Categoria"}
					</h3>
				</div>

				<form aria-label="Form creazione/modifica categoria">
					<div className="mb-4">
						<label
							htmlFor="categoryName"
							className="block mb-2 font-bold font-accesible-font"
						>
							Nome della Categoria
						</label>
						<input
							type="text"
							id="categoryName"
							value={categoryName}
							onChange={(e) => setCategoryName(e.target.value)}
							placeholder="Inserisci il nome della categoria"
							className="w-full border rounded p-2 mb-4"
						/>
					</div>

					<div className="flex justify-end">
						<button
							type="button"
							onClick={onClose}
							className="bg-red-600 text-white px-4 py-2 rounded mr-2"
						>
							Annulla
						</button>
						<button
							type="button"
							onClick={handleSave}
							className="bg-navbar-hover text-white px-4 py-2 rounded"
						>
							Salva
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CategoryModal;
