import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsonToMarkdown } from "../utils";
import rehypeRaw from "rehype-raw";

const TextBlock = ({
	content,
	className,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { content: any; className?: string }) => {
	const markdownContent = jsonToMarkdown(content);
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
					h5: ({ node, children }) => (
						<h5 style={{ fontSize: "20px" }}>{children}</h5>
					),
				}}
			>
				{markdownContent}
			</ReactMarkdown>
		</div>
	);
};

export default TextBlock;
