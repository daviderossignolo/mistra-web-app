import type React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './navbar.css';

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
      const url = "http://localhost:1337/api/main-menu?populate%5B0%5D=MainMenuItems&populate%5B1%5D=MainMenuItems.sections&populate%5B2%5D=MainMenuItems.sections.links";
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Errore nella richiesta: ${response.status}`);
        }

        const data = await response.json();
        setMenuData(data.data); // Salva i dati nel stato
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (error: any) {
        setError(error.message || "Si è verificato un errore durante il fetch.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div>Errore: {error}</div>;

  // Funzione per creare il menu
  const renderMenu = (items: MainMenuItem[]) => {
    return (
      <ul className="menu-list">
        {items.map((item) => {
          if (item.__component === "menu.menu-link") {
            if (item.title === "Test" && !isAuthenticated) {
              return null;
            }
            return (
              <li key={item.id}>
                {item.url ? (
                  <Link to={item.url}>{item.title}</Link>
                ) : (
                  <span>{item.title}</span>
                )}
              </li>
            );
          }
          if (item.__component === "menu.dropdown") {
            return (
              <li key={item.id} className="dropdown">
                <a href={item.url}>{item.title}</a>
                <div className="dropdown-content">
                  {item.sections.map((section) => (
                    <div key={section.id}>
                      <ul>
                        {section.links.map((link) => (
                          <li key={link.id}>
                            <a href={link.url}>{link.name}</a>
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
    <nav>
      {menuData ? renderMenu(menuData.MainMenuItems) : <div>Menu non disponibile</div>}
    </nav>
  );
};

export default MenuComponent;