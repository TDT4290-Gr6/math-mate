import { ChevronDown, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ChatContext } from '../hooks/useChatbot';
import { Step } from '@/entities/models/step';
import MessageBubble from './message-bubble';
import { cn } from '@/lib/utils';

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
    onSendMessage?: (message: string, chatContext: ChatContext) => void;
    onClose?: () => void;
    isLoading?: boolean;
    initialMessage?: ChatMessage;
    error?: string | null;
    steps?: Array<Step>;
    currentStep?: number;
    methodTitle?: string;
    methodDescription?: string;
    problemDescription?: string;
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
    error,
    steps,
    currentStep,
    methodTitle,
    methodDescription,
    problemDescription,
}: ChatbotWindowProps) {
    const [inputValue, setInputValue] = useState('');
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleSendMessage = async () => {
        if (inputValue.trim() && onSendMessage && !isLoading) {
            const messageToSend = inputValue.trim();
            setInputValue('');
            onSendMessage(messageToSend, {
                problemDescription,
                methodTitle,
                methodDescription,
                steps,
                currentStep,
            });
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
        <div className="flex w-full flex-col">
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
            <div className="flex w-full rounded-lg px-1">
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
                            'w-full rounded-3xl border border-[var(--border)] bg-[var(--chatbot)] px-4 py-3 pr-12 text-sm shadow-[0_-4px_8px_-1px_rgba(0,0,0,0.1)] transition-opacity',
                            isLoading && 'opacity-50',
                            error && 'border-[var(--destructive)]',
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
            <div className="flex min-h-10 w-full items-center justify-center">
                {' '}
                {error && <p className="text-[var(--destructive)]">{error}</p>}
            </div>
        </div>
    );
}
