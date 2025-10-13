import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';
import React, { memo } from 'react';
import rehypeSanitize from 'rehype-sanitize';

export interface LaTeXFormattedTextProps {
    text?: string;
    className?: string;
    sanitize?: boolean;  // Allow disabling for trusted content
}

// helper-function for replacing \[ with $
function replaceLaTeXBlock(text: string) {
    return text.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_, math) => `$$${math.trim()}$$`);
}

/**
 * `LaTeXFormattedText` is a reusable React component for rendering Markdown content
 * that includes LaTeX math expressions. It supports both inline (`$...$`) and block (`$$...$$`)
 * math formatting using `remark-math` and `rehype-katex`.
 *
 * @param {string} [text] - The Markdown string containing text and optional LaTeX math.
 * @param {string} [className] - Optional Tailwind or CSS class name for styling the container.
 *
 * @returns {JSX.Element | null} Rendered Markdown with LaTeX formatting, or `null` if no text is provided.
 */
function LaTeXFormattedTextComponent({
    text,
    className,
    sanitize = true,
}: LaTeXFormattedTextProps) {
    if (!text) return null;

    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[
                    ...(sanitize ? [rehypeSanitize] : []),
                    rehypeKatex,
                ]}
            >
                {replaceLaTeXBlock(text)}
            </ReactMarkdown>
        </div>
    );
}
export const LaTeXFormattedText = memo(LaTeXFormattedTextComponent);
