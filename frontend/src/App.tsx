import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import MenuComponent from "./components/navbar";
import Login from "./pages/Login";
import Page from "./pages/Page";
import PrivateRoute from "./components/PrivateRoute";
import TestPage from "./pages/testPage";
import ContactPage from "./pages/ContactPage";
import Homepage from "./pages/Homepage";
import Footer from "./components/footer";
import Header from "./components/header";

function App() {
	const [slugs, setRoutes] = useState<string[]>([]); // Stato per memorizzare i dati delle pagine
	const [loading, setLoading] = useState<boolean>(true); // Stato di caricamento

	useEffect(() => {
		const fetchPages = async () => {
			try {
				const response = await fetch("http://localhost:1337/api/pages");
				const data = await response.json();
				const pageData = data.data;
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				const slugs: string[] = pageData.map((page: any) => page.slug);
				setRoutes(slugs);
			} catch (error) {
				console.error("Errore durante il fetch delle pagine:", error);
			} finally {
				// Una volta completato il fetch (sia successo che errore), disattiva il loader
				setLoading(false);
			}
		};

		fetchPages();
	}, []);

	if (loading) {
		return <p>Caricamento in corso...</p>; // Mostra un messaggio di caricamento
	}

	return (
		<Router>
			<div className="App">
				<Header />
				<MenuComponent />
				<Routes>
					<Route path="/login" element={<Login />} />{" "}
					{/* Controllare la visualizzazione delle pagine protette dal login  */}
					<Route path="/test" element={<PrivateRoute element={TestPage} />} />
					<Route path="/contatti" element={<ContactPage slug="contatti" />} />
					<Route path="/" element={<Homepage />} />
					<Route path="/home" element={<Homepage />} />
					{slugs.map((slug: string) => (
						<Route
							key={slug}
							path={`/${slug}`}
							element={<Page slug={slug} />}
						/>
					))}
				</Routes>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
