import { ChevronDown, SendHorizontal } from 'lucide-react';
import MessageBubble from './message-bubble';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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

    const handleSendMessage = async () => {
        if (inputValue.trim() && onSendMessage && !isLoading) {
            const messageToSend = inputValue.trim();
            setInputValue("");
            onSendMessage(messageToSend);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div>
            <div className="relative">
                {onClose && (
                    <ChevronDown
                        onClick={onClose}
                        strokeWidth={2}
                        className="hover:text-accent cursor-pointer"
                    />
                )}
            </div>
            <div className="flex h-full max-h-90 flex-col-reverse space-y-2 space-y-reverse overflow-y-auto p-2">
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
                {[...chatHistory.messages].reverse().map((msg) => (
                    <MessageBubble key={msg.chatID} message={msg} />
                ))}
                {initialMessage && (
                    <MessageBubble
                        key={initialMessage.chatID}
                        message={initialMessage}
                    />
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
                                ? "Generating a response..."
                                : "Ask a question..."
                        }
                        className={cn(
                            "w-full rounded-lg bg-[var(--chatbot)] px-3 py-2 pr-12 text-sm transition-opacity",
                            isLoading && "opacity-50",
                        )}
                    />
                    <SendHorizontal
                        onClick={handleSendMessage}
                        strokeWidth={2.5}
                        size={20}
                        className={cn(
                            "absolute top-1/2 right-3 -translate-y-1/2 transition-colors",
                            isLoading
                                ? "text-border"
                                : "hover:text-accent cursor-pointer",
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
