import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface MenuLink {
	id: number;
	name: string;
	url: string;
	description: string;
}

interface DropdownSection {
	id: number;
	heading: string;
	links: MenuLink[];
}

interface DropdownMenu {
	__component: "menu.dropdown";
	id: number;
	title: string;
	url: string;
	sections: DropdownSection[];
}

interface MenuLinkItem {
	__component: "menu.menu-link";
	id: number;
	title: string;
	url: string | null;
}

type MainMenuItem = DropdownMenu | MenuLinkItem;

interface MenuData {
	id: number;
	documentId: string;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
	MainMenuItems: MainMenuItem[];
}

const MenuComponent: React.FC = () => {
	const [menuData, setMenuData] = useState<MenuData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMenuData = async () => {
			const url =
				"http://localhost:1337/api/main-menu?populate%5B0%5D=MainMenuItems&populate%5B1%5D=MainMenuItems.sections&populate%5B2%5D=MainMenuItems.sections.links";
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
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	if (loading) return <div className="p-4 text-center">Caricamento...</div>;
	if (error) return <div className="p-4 text-red-500">Errore: {error}</div>;

	const renderMenu = (items: MainMenuItem[]) => {
		return (
			<ul className="flex items-center justify-center space-x-4 w-full">
				{items.map((item) => {
					if (item.__component === "menu.menu-link") {
						if (item.title === "Test" && !isAuthenticated) {
							return null;
						}
						return (
							<li key={item.id} className="relative">
								{item.url ? (
									<Link
										to={item.url}
										className="text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200"
									>
										{item.title}
									</Link>
								) : (
									<span className="text-gray-700">{item.title}</span>
								)}
							</li>
						);
					}
					if (item.__component === "menu.dropdown") {
						return (
							<li key={item.id} className="relative group">
								<a
									href={item.url}
									className="text-gray-700 hover:text-blue-600 py-2 transition-colors duration-200"
								>
									{item.title}
								</a>
								<div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
									{item.sections.map((section) => (
										<div key={section.id} className="py-2">
											<ul>
												{section.links.map((link) => (
													<li key={link.id}>
														<a
															href={link.url}
															className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
														>
															{link.name}
														</a>
													</li>
												))}
											</ul>
										</div>
									))}
								</div>
							</li>
						);
					}
					return null;
				})}
			</ul>
		);
	};

	return (
		<nav className="bg-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-center h-16">
					{menuData ? (
						renderMenu(menuData.MainMenuItems)
					) : (
						<div className="p-4 text-gray-500">Menu non disponibile</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default MenuComponent;
