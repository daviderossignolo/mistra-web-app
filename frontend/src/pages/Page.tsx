import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import PageRenderer from '../components/PageRenderer';
import ContactPage from './ContactPage';


type PageData = {
    title: string;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    pageContent: any[];
 
};

type PageProps = {
  slug: string;
};

const Page: React.FC<PageProps> = ({ slug }) => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:1337/api/pages?filters[slug][$eq]=${slug}&populate=*`
        );
        if (!response.ok) {
          throw new Error('Errore durante il caricamento dei dati');
        }

        const data = await response.json();
        setPageData(data.data[0]);
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);

    // Memoizza il contenuto della pagina per evitare che venga ricreato
  const memoizedPageContent = useMemo(() => {
    return pageData?.pageContent || [];
  }, [pageData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!pageData) return <p>No page data found</p>;

  if (slug === 'contatti') {
    return <ContactPage pageData={pageData} />;
  }

  return (
    <div>
      <PageRenderer pageContent={memoizedPageContent} />
    </div>
  );
};

export default Page;
