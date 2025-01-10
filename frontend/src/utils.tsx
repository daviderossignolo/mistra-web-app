// Funzione che permette di convertire un JSON in un markdown per la visualizzazione attraverso react-markdown che renderizza il contenuto
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const jsonToMarkdown = (nodes: any[]) => {
	const convertNode = (node: {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		type: any;
		level: number;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		children: any[];
		text: string;
		bold: boolean;
		underline: boolean;
		italic: boolean;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		url: any;
		format: string;
	}): string => {
		switch (node.type) {
			case "heading":
				return `${"#".repeat(node.level)} ${node.children.map(convertNode).join("")}\n\n`;
			case "paragraph":
				return `${node.children.map(convertNode).join("")}\n\n`;
			case "text": {
				let text = node.text || "";
				if (node.bold) text = `**${text}**`;
				if (node.underline) text = `${text}`;
				if (node.italic) text = `*${text}*`;
				return text;
			}
			case "link": {
				const linkContent: string = node.children.map(convertNode).join("");
				return `[${linkContent}](${node.url})`;
			}
			case "list": {
				const marker = node.format === "ordered" ? "1." : "-";
				return `${node.children
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					.map((child: any) => `${marker} ${convertNode(child)}`)
					.join("\n")}\n\n`;
			}
			case "list-item":
				return node.children.map(convertNode).join("");
			default:
				return "";
		}
	};

	return nodes.map(convertNode).join("");
};

export function formatTime(time: string): string {
	if (!time) return "";
	return time.split(":").slice(0, 2).join(":");
}
