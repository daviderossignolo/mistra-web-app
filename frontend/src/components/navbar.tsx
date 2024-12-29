import type React from 'react';
import { useEffect, useState } from 'react';
import './navbar.css';

// Define an interface for the Navbar links
interface NavbarLink {
  id: number;
  label: string;
  url: string;
}

// Define a type for the response we expect from Strapi
interface StrapiResponse<T> {
  data: Array<{
    id: number;
    attributes: T;
  }>;
}

// Build the Navbar component
const Navbar: React.FC = () => {
  // State to hold fetched links
  const [links, setLinks] = useState<NavbarLink[]>([]);

  // Fetch data from the Strapi API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/navbar-links", {
          headers: {
            Authorization: "Bearer c4afd260834df2386d0ea4c9d0f85ee2a3c0b134fbd27a2a8c26dd41cc6ee169916bcd5ccbbdfbca8d0eeafb9eae7e1fe9a9c1c361c2467c510e01e5cf1e104b5ee2372e780e5889cf9db74cb0a3695b4eddcc013db479eddb1f3528a9c0039cdec8c45174f85f79deee356d8b2bc63a290a3eda9462df6a5ac16617e8b0089c", // Set the token in the headers
          },
        });
        const result = await response.json();

        // Map through Strapi response to normalize data
        const fetchedLinks = result.data.map((item: { id: number; label: string; url: string }) => ({
          id: item.id,
          label: item.label,
          url: item.url,
        }));
        setLinks(fetchedLinks); // Update the state
      } catch (error) {
        console.error('Error fetching navbar links:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="https://static.wixstatic.com/media/6cd85c_fb7295de814747b7890cb709a6d17e96~mv2.jpg/v1/fill/w_265,h_258,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/MISTRA%252520LOGO_edited_edited.jpg" alt="Logo Centro MISTRA"/>
      </div>
      <ul className="navbar-links">
        {links.map((link) => (
          <li key={link.id}>
            <a href={link.url}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;