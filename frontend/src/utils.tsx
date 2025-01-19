// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const jsonToMarkdown = (nodes: any[]) => {
	const convertNode = (node: {
		type: string;
		level?: number;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		children?: any[];
		text?: string;
		bold?: boolean;
		underline?: boolean;
		italic?: boolean;
		url?: string;
		format?: "ordered" | "unordered";
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		image?: any;
	}): string => {
		switch (node.type) {
			case "heading":
				return `${"#".repeat(node.level || 1)} ${node.children?.map(convertNode).join("")}\n\n`;

			case "paragraph":
				return `${node.children?.map(convertNode).join("")}\n\n`;

			case "text": {
				let text = node.text || "";
				if (node.bold) text = `**${text}**`;
				if (node.italic) text = `*${text}*`;
				if (node.underline) text = `<u>${text}</u>`;
				return text;
			}

			case "link": {
				const linkContent = node.children?.map(convertNode).join("") || "";
				return `[${linkContent}](${node.url})`;
			}

			case "list": {
				// Add a blank line before the list
				const marker = node.format === "ordered" ? "1." : "-";
				const listItems = node.children
					?.map((child) => {
						const itemContent = convertNode(child);
						// Handle multi-line content by adding proper indentation
						const indentedContent = itemContent
							.split("\n")
							.map((line, index) => (index === 0 ? line : `    ${line}`))
							.join("\n");
						return `${marker} ${indentedContent}`;
					})
					.join("\n");
				// Add blank lines before and after the list
				return `\n${listItems}\n\n`;
			}

			case "list-item": {
				return node.children?.map(convertNode).join("") || "";
			}

			case "image": {
				return `![${node.image.alternativeText}](${node.image.url})`;
			}

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
