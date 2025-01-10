import  { useMemo } from 'react';
import TextBlock from '../components/textBlock';
import MapBlock from '../components/mapBlock';
import "../styles/contactPage.css";

type ContactPageProps = {
    pageData: {
        title: string;
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        pageContent: any[];
    }
};

// Definisco il functional component ContactPage che rappresenta la pagina dei contatti
// Il componente viene utilizzato per renderizzare la pagina dei contatti.
const ContactPage: React.FC<ContactPageProps> = ({ pageData }) => {
    console.log('Page data:', pageData);

    const renderBlocks = useMemo(() => {
        
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        return pageData.pageContent.map((block: any, index: number) => {
            const isAlternate = index % 2 === 0; 
            const blockClassName = isAlternate ? 'block block-gray' : 'block'; 
            switch (block.__component) {
                case 'page-block.text-block':
                    return(
                        <div key={block.id} className={blockClassName}>
                            <TextBlock content={block.content}/>
                        </div>
                    );
                case 'page-block.map-block':
                    return (
                        <div>
                            <MapBlock description={block.description} city={block.city} address={block.address} latitude={block.latitude} longitude={block.longitude} cap={block.cap} />
                        </div>
                    );
                default:
                    return null;
            }
        });
    }, [pageData.pageContent]);

    return (
        <div className="contact-page-content">
            {renderBlocks}
        </div>
    );
};

export default ContactPage;