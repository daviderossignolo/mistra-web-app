import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsonToMarkdown } from "../utils";
import rehypeRaw from "rehype-raw";

type JsonNode = {
	type: string;
	children: { type: string; text: string }[];
	level: number;
};

const TextBlock = ({
	content,
	className,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { content: any; className?: string }) => {
	const markdownContent = jsonToMarkdown(content);
	console.log(markdownContent);
	return (
		<div className={className}>
			<ReactMarkdown
				className="markdown"
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw]}
				components={{
					u: ({ node, children }) => (
						<span style={{ textDecoration: "underline" }}>{children}</span>
					),
				}}
			>
				{markdownContent}
			</ReactMarkdown>
		</div>
	);
};

export default TextBlock;
