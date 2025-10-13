import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import React from 'react';

export interface LaTeXFormattedTextProps {
    text?: string;
    className?: string;
}

export default function LaTeXFormattedText({
    text,
    className,
}: LaTeXFormattedTextProps) {
    if (!text) return null;

    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
            >
                {text}
            </ReactMarkdown>
        </div>
    );
}
