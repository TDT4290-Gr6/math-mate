import { ChevronDown, SendHorizontal } from 'lucide-react';
import { cn, extractPlainTextMath } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { ChatContext } from '../hooks/useChatbot';
import { Step } from '@/entities/models/step';
import MessageBubble from './message-bubble';

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
    const [announcement, setAnnouncement] = useState('');
    const containerRef = useRef<HTMLDivElement | null>(null);
    const previousMessageCount = useRef(0);
    const inputRef = useRef<HTMLInputElement>(null);

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

    // Scroll to bottom when adding new messages
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [chatHistory.messages.length]);

    // Announce new assistant messages to screen readers
    useEffect(() => {
        const currentMessageCount = chatHistory.messages.length;

        if (currentMessageCount > previousMessageCount.current) {
            const newMessage = chatHistory.messages[currentMessageCount - 1];

            // Only announce assistant messages (not user's own messages)
            if (newMessage.sender === 'assistant') {
                setAnnouncement('');
                setTimeout(() => {
                    setAnnouncement(
                        `Assistant says: ${extractPlainTextMath(newMessage.content)}`,
                    );
                }, 100);
            }
        }

        previousMessageCount.current = currentMessageCount;
    }, [chatHistory.messages]);

    // Announce loading state
    useEffect(() => {
        if (isLoading) {
            setAnnouncement('');
            setTimeout(() => {
                setAnnouncement('Assistant is typing...');
            }, 100);
        }
    }, [isLoading]);

    return (
        <div
            className="flex w-full flex-col"
            role="complementary"
            aria-label="Chat assistant"
        >
            {/* Screen reader announcements */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {announcement}
            </div>

            {/* Close button */}
            <div className="relative">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close chat"
                        className="hover:text-accent absolute mt-3 cursor-pointer"
                    >
                        <ChevronDown strokeWidth={2} />
                    </button>
                )}
            </div>

            {/* Chat messages */}
            <div
                ref={containerRef}
                className="mt-5 flex h-92 flex-col space-y-2 overflow-y-auto p-2"
                role="log"
                aria-label="Chat conversation"
                aria-live="off" // We handle announcements manually
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
                    <div
                        className="mb-4 flex w-full justify-start"
                        aria-hidden="true"
                    >
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

            {/* Input form */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                }}
                className="flex w-full rounded-lg px-1"
            >
                <div className="relative flex-1">
                    <label htmlFor="chat-input" className="sr-only">
                        Ask a question
                    </label>
                    <input
                        id="chat-input"
                        ref={inputRef}
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
                        aria-describedby={error ? 'chat-error' : undefined}
                        aria-invalid={error ? 'true' : 'false'}
                        className={cn(
                            'w-full rounded-3xl border border-[var(--border)] bg-[var(--chatbot)] px-4 py-3 pr-12 text-sm shadow-[0_-4px_8px_-1px_rgba(0,0,0,0.1)] transition-opacity',
                            isLoading && 'opacity-50',
                            error && 'border-[var(--destructive)]',
                        )}
                    />
                    <button
                        type="submit"
                        // onClick={handleSendMessage}
                        disabled={isLoading || !inputValue.trim()}
                        aria-label="Send message"
                        className={cn(
                            'absolute top-1/2 right-3 -translate-y-1/2 transition-colors',
                            isLoading || !inputValue.trim()
                                ? 'text-border cursor-not-allowed'
                                : 'hover:text-accent cursor-pointer',
                        )}
                    >
                        <SendHorizontal strokeWidth={2.5} size={20} />
                    </button>
                </div>
            </form>

            {/* Error display */}
            <div
                className="flex min-h-10 w-full items-center justify-center"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                {error && (
                    <p id="chat-error" className="text-[var(--destructive)]">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}
