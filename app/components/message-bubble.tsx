import LaTeXFormattedText from './ui/latex-formatted-text';
import { ChatMessage } from './chatbot-window';
import { cn } from '@/lib/utils';
import React from 'react';

interface MessageBubbleProps {
    message: ChatMessage;
}

/**
 * MessageBubble
 *
 * Displays a single chat message. Styles differ for 'user' and 'bot' senders.
 * Accepts an optional `className` on the message to allow custom styling
 * (e.g. privacy notice). Keeps layout simple and responsive.
 */
export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.sender === 'user';

    return (
        <div
            className={cn(
                'mb-4 flex w-full',
                isUser ? 'justify-end' : 'justify-start',
            )}
        >
            <div
                className={cn(
                    'rounded-lg px-4 py-2 text-sm break-words',
                    isUser
                        ? 'max-w-[70%] rounded-br-sm bg-[var(--chatbot)]'
                        : 'bg-background',
                    message.className, // Apply custom styling if provided
                )}
            >
                <LaTeXFormattedText text={message.content} />
            </div>
        </div>
    );
}
