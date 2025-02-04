import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import MenuComponent from "./components/navbar";
import PrivateRoute from "./components/PrivateRoute";
import About from "./pages/About";
import EventsPage from "./pages/EventsPage";
import Homepage from "./pages/Homepage";
import InfectionList from "./pages/InfectionListPage";
import InfectionPage from "./pages/InfectionPage";
import Login from "./pages/Login";
import NewsPage from "./pages/newsPage";
import ServicePage from "./pages/ServicePage";
import ServicesListPage from "./pages/ServicesListPage";
import UsefulLinksPage from "./pages/UsefulLinksPage";
import CreateTestPage from "./pages/CreateTestPage";
import ContactPage from "./pages/ContactPage";
import TakeQuiz from "./components/takeQuiz";
import DashboardPage from "./pages/DashboardPage";

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
					<Route
						path="/test"
						element={<PrivateRoute element={CreateTestPage} />}
					/>
					<Route path="/taketest" element={<TakeQuiz />} />
					<Route path="/contatti" element={<ContactPage />} />
					<Route path="/" element={<Homepage />} />
					<Route path="/home" element={<Homepage />} />
					<Route path="/chi-siamo" element={<About />} />
					<Route path="/infezioni" element={<InfectionList />} />
					<Route path="/servizi" element={<ServicesListPage />} />
					<Route path="/link-utili" element={<UsefulLinksPage />} />
					<Route path="/eventi" element={<EventsPage />} />
					<Route path="/dashboard" element={<DashboardPage />} />
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
