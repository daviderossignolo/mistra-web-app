import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Category } from "./questionModal";

interface CategoryModalProps {
	onClose: () => void;
	onSave: (category: Category) => void;
}

// Componente per il modale di creazione categoria
const CategoryModal: React.FC<CategoryModalProps> = ({ onClose, onSave }) => {
	const [categoryName, setCategoryName] = useState<string>("");

	// Funzione che gestisce il salvataggio della categoria
	const handleSave = async () => {
		// La categoria non è stata compilata quindi faccio apparire un alert
		if (!categoryName || categoryName === "") {
			alert("Il nome della categoria non può essere vuoto.");
			return;
		}

		try {
			// Eseguo la chiamata API al plugin per salvare la categoria
			const category_id = uuidv4();
			const name = categoryName.trim();
			const response = await fetch(
				"http://localhost:1337/api/test-plugin/create-category",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id_category: category_id, name: name }),
				},
			);

			// Se la risposta non è ok, lancio un errore
			if (!response.ok) {
				throw new Error("Errore durante il salvataggio della categoria");
			}

			// Chiamo la funzione onSave passata come prop e chiudo il modale
			onSave({ name: name, id_category: category_id });
			onClose();
		} catch (error) {
			alert(
				"Si è verificato un errore durante il salvataggio della categoria.",
			);
			console.error(error);
		}
	};

	return (
		<div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center font-poppins text-navbar-hover">
			<div className="bg-white w-11/12 max-w-md p-4 rounded shadow-lg">
				<div className="w-full bg-navbar-hover px-4 py-4 mb-4">
					<h3 className="font-bold text-center text-white">Nuova Categoria</h3>
				</div>

				{/* Label e campo input per il nome della categoria */}
				<label
					htmlFor="categoryName"
					className="block mb-2 font-bold font-poppins"
				>
					Nome della Categoria
				</label>
				<input
					id="categoryName"
					value={categoryName}
					onChange={(e) => setCategoryName(e.target.value)}
					placeholder="Inserisci il nome della categoria"
					className="w-full border rounded p-2 mb-4"
				/>

				{/* Div per i bottoni allineati a destra */}
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
			</div>
		</div>
	);
};

export default CategoryModal;
