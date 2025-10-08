import { ChevronDown, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MessageBubble from './message-bubble';
import { cn } from '@/lib/utils';

export interface ChatMessage {
    chatID: string;
    sender: 'user' | 'bot';
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
}

export default function ChatbotWindow({
    chatHistory,
    onSendMessage,
    onClose,
    isLoading,
    initialMessage,
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
                className="mt-5 flex h-full max-h-90 flex-col space-y-2 overflow-y-auto p-2"
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
            <div className="flex w-full p-2">
                <div className="relative flex-1">
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
        </div>
    );
}
