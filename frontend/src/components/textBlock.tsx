import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { jsonToMarkdown } from "../utils";

type JsonNode = {
    type: string
    children: { type: string, text: string }[]
    level: number
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const TextBlock = ({ content, className }: { content: any, className?: string }) => {
  const markdownContent = jsonToMarkdown(content);
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
    </div>
  );
};

export default TextBlock;