import type React from 'react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Homepage: React.FC = () => {
  const [articleContent, setArticleContent] = useState<string>(''); // Stato per il contenuto dell'articolo
  const [articleTitle, setArticleTitle] = useState<string>(''); // Stato per il titolo dell'articolo


  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/articles/a48kvyn6lerbo5tvy0zfoyre', {
          headers: {
            Authorization: 'Bearer ', // Sostituisci con il tuo token
          },
        });
        const data = await response.json();
     
        setArticleTitle(data.data.title); // Accedi al titolo dell'articolo
        // Accedi al contenuto dell'articolo (Markdown o HTML)
        setArticleContent(data.data.content); // Supponendo che il campo si chiami "content"
      } catch (error) {
        console.error("Errore durante il recupero dell'articolo:", error);
      }
    };

    fetchArticle();
  }, []);

  return (
    <div className="homepage">
      <h1>{articleTitle}</h1>
      <ReactMarkdown>{articleContent}</ReactMarkdown>
    </div>
  );
};

export default Homepage;

