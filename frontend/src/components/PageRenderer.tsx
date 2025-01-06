import type React from "react";
// import TextBlock from "./blocks/TextBlock";
// import ImageBlock from "./blocks/ImageBlock";
// import VideoBlock from "./blocks/VideoBlock";
// import CallToActionBlock from "./blocks/CallToActionBlock";
import TextBlock from "./textBlock";
import { type JSX, useMemo } from "react";

// definisco il tipo per i blocchi
type Block =  {
  __component: string;
  id: React.Key | null | undefined;
  content: string;
  url?: string;
  alt?: string;
  text?: string;
  link?: string;
}


/**
 * Il componente PageRenderer renderizza a una lista di blocchi.
 * 
 * @param {Block[]} props.pageContent i blocchi da renderizzare.
 * @returns {JSX.Element} il blocco renderizzato.
 */
const PageRenderer: React.FC<{pageContent: Block[]}> = ({ pageContent }: { pageContent: Block[]; }): JSX.Element => {
    // useMemo viene eseguita solo quando pageContent cambia
    const renderBlock = useMemo(() => {
        return pageContent.map((block: Block) => {
            switch (block.__component) {
                case "page-block.text-block":
                    console.log("BLOCK: ", block.content);
                    return <TextBlock key={block.id} content={block.content} />;
                default:
                    return null;
            }
        });
    }, [pageContent]);

    return <div>{renderBlock}</div>;
};

export default PageRenderer;