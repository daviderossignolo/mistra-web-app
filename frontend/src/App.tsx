import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import MenuComponent from "./components/navbar";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import TestPage from "./pages/testPage";
import Homepage from "./pages/Homepage";
import Footer from "./components/footer";
import Header from "./components/header";
import About from "./pages/About";
import InfectionPage from "./pages/InfectionPage";
import InfectionList from "./pages/InfectionListPage";
import ServicePage from "./pages/ServicePage";
import ServicesListPage from "./pages/ServicesListPage";
import ContattiPage from "./pages/ContattiPage";
import NewsPage from "./pages/newsPage";
import UsefulLinksPage from "./pages/UsefulLinksPage";
import EventsPage from "./pages/EventsPage";
import TakeQuizSetup from "./components/TakeQuizSetup";

function App() {
	const [loading, setLoading] = useState<boolean>(true);
	const [infectionSlugs, setInfectionSlugs] = useState<string[]>([]);
	const [serviceSlugs, setServiceSlugs] = useState<string[]>([]);
	const [newsSlugs, setNewsSlugs] = useState<string[]>([]);
	useEffect(() => {
		const fetchPages = async () => {
			try {
				const infectionResponse = await fetch(
					"http://localhost:1337/api/infection-pages",
				);
				const serviceResponse = await fetch(
					"http://localhost:1337/api/services-pages",
				);
				const newsResponse = await fetch(
					"http://localhost:1337/api/news-pages",
				);

				const infectionData = await infectionResponse.json();
				const infectionSlugs: string[] = infectionData.data.map(
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(page: any) => page.slug,
				);
				const serviceData = await serviceResponse.json();
				const servicesSlugs: string[] = serviceData.data.map(
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(page: any) => page.slug,
				);
				const newsData = await newsResponse.json();
				const newsSlugs: string[] = newsData.data.map(
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					(page: any) => page.slug,
				);
				setNewsSlugs(newsSlugs);
				setInfectionSlugs(infectionSlugs);
				setServiceSlugs(servicesSlugs);
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
					<Route path="/taketest" element={<TakeQuizSetup />} />
					<Route path="/contatti" element={<ContattiPage />} />
					<Route path="/" element={<Homepage />} />
					<Route path="/home" element={<Homepage />} />
					<Route path="/chi-siamo" element={<About />} />
					<Route path="/infezioni" element={<InfectionList />} />
					<Route path="/servizi" element={<ServicesListPage />} />
					<Route path="/link-utili" element={<UsefulLinksPage />} />
					<Route path="/eventi" element={<EventsPage />} />
					{infectionSlugs.map((slug: string) => (
						<Route
							key={slug}
							path={`/${slug}`}
							element={<InfectionPage slug={slug} />}
						/>
					))}
					{serviceSlugs.map((slug: string) => (
						<Route
							key={slug}
							path={`/${slug}`}
							element={<ServicePage slug={slug} />}
						/>
					))}
					{newsSlugs.map((slug: string) => (
						<Route
							key={slug}
							path={`/${slug}`}
							element={<NewsPage slug={slug} />}
						/>
					))}
				</Routes>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
