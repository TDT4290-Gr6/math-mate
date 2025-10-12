import { ChevronDown, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MessageBubble from './message-bubble';
import { cn } from '@/lib/utils';
import { error } from 'console';

export interface ChatMessage {
    chatID: string;
    sender: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    className?: string;
}

export interface ChatHistory {
    messages: Array<ChatMessage>;
}

interface ChatbotWindowProps {
    chatHistory: ChatHistory;
    onSendMessage?: (message: string) => void;
    onClose?: () => void;
    isLoading?: boolean;
    initialMessage?: ChatMessage;
    error?: string | null;
}

/**
 * ChatbotWindow component
 *
 * Renders a chat panel showing `chatHistory` messages, an optional
 * initial privacy message, and an input to send new messages.
 *
 * Props:
 * @param chatHistory - Current chat messages shown in the panel
 * @param onSendMessage - Optional callback invoked when user sends a message
 * @param onClose - Optional callback to close the chat panel
 * @param isLoading - When true, disables input and shows a loading indicator
 * @param initialMessage - Optional single message shown when the chat opens
 */
export default function ChatbotWindow({
    chatHistory,
    onSendMessage,
    onClose,
    isLoading,
    initialMessage,
    error
}: ChatbotWindowProps) {
    const [inputValue, setInputValue] = useState('');
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleSendMessage = async () => {
        if (inputValue.trim() && onSendMessage && !isLoading) {
            const messageToSend = inputValue.trim();
            setInputValue('');
            onSendMessage(messageToSend);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        // Scroll to bottom when adding new messages
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [chatHistory.messages.length]);


    return (
        <div>
            <div className="relative">
                {onClose && (
                    <ChevronDown
                        onClick={onClose}
                        strokeWidth={2}
                        className="hover:text-accent absolute mt-3 cursor-pointer"
                    />
                )}
            </div>
            <div
                ref={containerRef}
                className="mt-5 flex h-92 flex-col space-y-2 overflow-y-auto p-2"
            >
                {initialMessage && (
                    <MessageBubble
                        key={initialMessage.chatID}
                        message={initialMessage}
                    />
                )}
                {chatHistory.messages.map((msg) => (
                    <MessageBubble key={msg.chatID} message={msg} />
                ))}
                {isLoading && (
                    <div className="mb-4 flex w-full justify-start">
                        <div className="animate-pulse rounded-lg bg-[var(--loading)] px-4 py-2 text-sm">
                            <div className="flex items-center space-x-1">
                                <div className="flex space-x-1">
                                    <div className="bg-border h-2 w-2 animate-bounce rounded-full" />
                                    <div
                                        className="bg-border h-2 w-2 animate-bounce rounded-full"
                                        style={{ animationDelay: '0.1s' }}
                                    />
                                    <div
                                        className="bg-border h-2 w-2 animate-bounce rounded-full"
                                        style={{ animationDelay: '0.2s' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex w-full px-4 rounded-lg">
                <div className={`relative flex-1 ${error && "border border-[var(--destructive)] "} rounded-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.2)]`}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        placeholder={
                            isLoading
                                ? 'Generating a response...'
                                : 'Ask a question...'
                        }
                        className={cn(
                            'w-full rounded-lg bg-[var(--chatbot)] px-3 py-2 pr-12 text-sm transition-opacity',
                            isLoading && 'opacity-50',
                        )}
                    />
                    <SendHorizontal
                        onClick={handleSendMessage}
                        strokeWidth={2.5}
                        size={20}
                        className={cn(
                            'absolute top-1/2 right-3 -translate-y-1/2 transition-colors',
                            isLoading
                                ? 'text-border'
                                : 'hover:text-accent cursor-pointer',
                        )}
                    />
                </div>
            </div>
            <div className='flex  w-full justify-center items-end mt-4'> {error && <p className="text-[var(--destructive)]">{error}</p>}</div>
        </div>
    );
}
