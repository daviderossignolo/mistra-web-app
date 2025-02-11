import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type MenuLink = {
	id: number;
	name: string;
	url: string;
	description: string;
};

type DropdownSection = {
	id: number;
	heading: string;
	links: MenuLink[];
};

type DropdownMenu = {
	__component: "menu.dropdown";
	id: number;
	title: string;
	url: string;
	sections: DropdownSection[];
};

type MenuLinkItem = {
	__component: "menu.menu-link";
	id: number;
	title: string;
	url: string | null;
};

type MainMenuItem = DropdownMenu | MenuLinkItem;

type MenuData = {
	id: number;
	documentId: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	MainMenuItems: MainMenuItem[];
};

const MenuComponent: React.FC = () => {
	const [menuData, setMenuData] = useState<MenuData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	// stato per gestire l'apertura e la chiusura del menù mobile
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const [activeDropdowns, setActiveDropdowns] = useState<Set<number>>(
		new Set(),
	);
	const navigate = useNavigate();

	// Recupero il base url e l'host del backend strapi
	const baseUrl = process.env.REACT_APP_BACKEND_HOST;
	const port = process.env.REACT_APP_BACKEND_PORT;

	// Funzione che recupera i dati delle voci del menù dal backend strapi
	useEffect(() => {
		const fetchMenuData = async () => {
			// populate%5B0%5D=MainMenuItems&populate%5B1%5D=MainMenuItems.sections&populate%5B2%5D=MainMenuItems.sections.links
			const url = `${baseUrl}:${port}/api/main-menu?pLevel`;
			try {
				const response = await fetch(url);

				if (!response.ok) {
					throw new Error(`Errore nella richiesta: ${response.status}`);
				}

				const data = await response.json();
				setMenuData(data.data);
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} catch (error: any) {
				setError(
					error.message || "Si è verificato un errore durante il fetch.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchMenuData();
	}, [baseUrl, port]);

	// Funzione che controlla se l'utente è autenticato
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	// FUnzione che permette di aprire o chiudere un dropdown
	const toggleDropdown = (id: number) => {
		setActiveDropdowns((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	// Funzione che permette di effettuare il logout
	const handleLogout = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	): void => {
		// Rimuovo il token dal localStorage e setto isAuthenticated a false
		event.preventDefault();
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		navigate("/login");
	};

	// Loading spinner se i dati sono in caricamento
	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) return <div className="p-4 text-red-700">Errore: {error}</div>;

	const renderMenu = (items: MainMenuItem[], isMobile = false) => {
		return (
			<ul
				className={`${
					isMobile ? "flex flex-col space-y-2" : "flex items-center space-x-4"
				}`}
				role="menu"
			>
				{items.map((item) => {
					if (item.__component === "menu.menu-link") {
						if (item.title === "Dashboard" && !isAuthenticated) {
							return null;
						}
						return (
							<li key={item.id} className="relative" role="none">
								{item.url ? (
									<Link
										to={item.url}
										className="text-white py-2 px-4 transition-colors duration-200 hover:bg-navbar-hover rounded font-poppins text-sm"
										role="menuitem"
									>
										{item.title}
									</Link>
								) : (
									<span
										className="text-white px-4 hover_bg-navbar-hover rounded font-poppins text-sm"
										role="menuitem"
									>
										{item.title}
									</span>
								)}
							</li>
						);
					}
					if (item.__component === "menu.dropdown") {
						return (
							<li key={item.id} className="relative group" role="none">
								<button
									className={`text-white px-4 py-2 font-poppins text-sm transition-colors duration-200 hover:bg-navbar-hover rounded ${
										isMobile
											? "flex justify-between items-center cursor-pointer"
											: ""
									}`}
									onClick={() => {
										toggleDropdown(item.id);
										window.location.href = item.url;
									}}
									type="button"
									aria-expanded={activeDropdowns.has(item.id)}
									aria-haspopup="true"
									aria-label={`Apri il menu ${item.title}`}
									role="menuitem"
								>
									{item.title}
									{isMobile && (
										<span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className={`h-5 w-5 transition-transform ${
													activeDropdowns.has(item.id)
														? "rotate-180"
														: "rotate-0"
												}`}
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												aria-hidden="true"
											>
												<title>Dropdown</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</span>
									)}
								</button>
								{/* Dropdown Content */}
								<div
									className={`${
										isMobile
											? activeDropdowns.has(item.id)
												? "block"
												: "hidden"
											: "absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-navbar rounded-md shadow-lg opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible  group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
									}`}
									role="menu"
									aria-label={item.title}
								>
									<ul className={`${isMobile ? "pl-4 space-y-2" : ""}`}>
										{item.sections.map((section) => (
											<div key={section.id}>
												{section.links.map((link) => (
													<li key={link.id} role="none">
														<a
															href={link.url}
															className="block px-4 py-2 text-sm font-poppins text-white hover:bg-navbar-hover"
															role="menuitem"
															tabIndex={0}
														>
															{link.name}
														</a>
													</li>
												))}
											</div>
										))}
									</ul>
								</div>
							</li>
						);
					}
					return null;
				})}
				<li className="relative" role="none">
					{isAuthenticated ? (
						<button
							type="button"
							onClick={handleLogout}
							className="text-white py-2 px-4 transition-colors font-poppins text-sm duration-200 hover:bg-navbar-hover rounded"
							role="menuitem"
						>
							Logout
						</button>
					) : (
						<Link
							to="/login"
							className="text-white py-2 px-4 transition-colors font-poppins text-sm duration-200 hover:bg-navbar-hover rounded"
							role="menuitem"
						>
							Login
						</Link>
					)}
				</li>
			</ul>
		);
	};

	return (
		<nav className="bg-navbar shadow-md" aria-label="Main Navigation">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 container">
					<div className="sm:hidden">
						<button
							type="button"
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="text-navbar-hover focus:outline-none"
							aria-label="Apri/Chiudi menu"
							aria-expanded={isMenuOpen}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>Menu</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						</button>
					</div>
					<div className="hidden sm:flex justify-center flex-1 text-">
						{menuData ? renderMenu(menuData.MainMenuItems) : null}
					</div>
				</div>

				{/* Mobile Dropdown Menu */}
				{isMenuOpen && (
					<div className="sm:hidden" aria-hidden={!isMenuOpen}>
						<div className="py-4">
							{menuData ? renderMenu(menuData.MainMenuItems, true) : null}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default MenuComponent;
