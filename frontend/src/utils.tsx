// Funzione che permette di convertire un JSON in un markdown per la visualizzazione attraverso react-markdown che renderizza il contenuto
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const jsonToMarkdown = (nodes: any[]) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const convertNode = (node: { type: any; level: number; children: any[]; text: string; bold: any; underline: any; url: any; format: string; }): string => {
    switch (node.type) {
      case "heading":
        return `${"#".repeat(node.level)} ${node.children.map(convertNode).join("")}\n\n`;
      case "paragraph":
        return `${node.children.map(convertNode).join("")}\n\n`;
      case "text": {
        let text = node.text || "";
        if (node.bold) text = `**${text}**`;
        if (node.underline) text = `${text}`;
        return text;
      }
      case "link": {
        const linkContent: string = node.children.map(convertNode).join("");
        return `[${linkContent}](${node.url})`;
      }
      case "list": {
        const marker = node.format === "ordered" ? "1." : "-";
        return `${// biome-ignore lint/suspicious/noExplicitAny: <explanation>
            node.children.map((child: any) => `${marker} ${convertNode(child)}`).join("\n")}\n\n`;
    }
      case "list-item":
        return node.children.map(convertNode).join("");
      default:
        return "";
    }
  };

  return nodes.map(convertNode).join("");
};