import rehypeSanitize from 'rehype-sanitize';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import React, { memo } from 'react';
import remarkGfm from 'remark-gfm';
import 'katex/dist/katex.min.css';

export interface LaTeXFormattedTextProps {
    text?: string;
    className?: string;
    sanitize?: boolean;
}

function replaceLaTeXBlock(text: string) {
    return text.replace(
        /\\\[\s*([\s\S]*?)\s*\\\]/g,
        (_, math) => `$$${math.trim()}$$`,
    );
}

// Extrahiere Klartext-Version für Screenreader
function extractPlainTextMath(text: string): string {
    return text
        .replace(/\$\$(.*?)\$\$/g, (_, math) => ` Formel: ${math} `)
        .replace(/\$(.*?)\$/g, (_, math) => ` ${math} `)
        .replace(/<[^>]+>/g, '') // HTML-Tags entfernen
        .replace(/\s+/g, ' ')
        .trim();
}

function LaTeXFormattedTextComponent({
    text,
    className,
    sanitize = true,
}: LaTeXFormattedTextProps) {
    if (!text) return null;

    const processedText = replaceLaTeXBlock(text);
    const plainTextVersion = extractPlainTextMath(processedText);

    return (
        <div className={className}>
            {/* Screenreader-Version mit Klartext */}
            <div
                className="sr-only"
                role="article"
                aria-label="Mathproblem"
                aria-live="polite"
            >
                {plainTextVersion}
            </div>

            {/* Visuelle Version mit KaTeX */}
            <div aria-hidden="true">
                <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[
                        ...(sanitize ? [rehypeSanitize] : []),
                        [
                            rehypeKatex,
                            {
                                output: 'htmlAndMathml', // Bessere Screenreader-Unterstützung
                                throwOnError: false,
                            },
                        ],
                    ]}
                >
                    {processedText}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export const LaTeXFormattedText = memo(LaTeXFormattedTextComponent);
