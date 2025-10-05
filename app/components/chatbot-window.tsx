import { ChevronDown, SendHorizontal } from 'lucide-react';
import MessageBubble from './message-bubble';
import { useState } from 'react';
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
    placeholder?: string;
    onSendMessage?: (message: string) => void;
    onClose?: () => void;
    isLoading?: boolean;
    initialMessage?: ChatMessage;
}

export default function ChatbotWindow({
    chatHistory,
    placeholder,
    onSendMessage,
    onClose,
    isLoading,
    initialMessage,
}: ChatbotWindowProps) {
    const [inputValue, setInputValue] = useState('');

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

    return (
        <div>
            <div className="relative">

            {onClose &&
            <ChevronDown onClick={onClose} strokeWidth={2} className="cursor-pointer text-[#3D3C3A] hover:text-[#EB5E28]"/>
        }
        </div>
            <div className="flex h-full max-h-80 flex-col-reverse overflow-y-auto p-2 space-y-2 space-y-reverse">
                {isLoading && (
                    <div className="mb-4 flex w-full justify-start">
                        <div className="rounded-lg px-4 py-2 text-sm bg-gray-100 animate-pulse">
                            <div className="flex items-center space-x-1">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"/>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}/>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}/>
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
                        placeholder={isLoading ? "Generating a response..." : (placeholder || "Ask a question...")}
                        className={cn(
                            "w-full px-3 py-2 pr-12 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB5E28] focus:border-transparent transition-opacity",
                            isLoading && "opacity-50"
                        )}
                    />
                    <SendHorizontal 
                        onClick={handleSendMessage}
                        strokeWidth={2.5} 
                        size={20}
                        className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2 transition-colors",
                            isLoading 
                                ? "text-gray-400" 
                                : "cursor-pointer text-[#3D3C3A] hover:text-[#EB5E28]"
                        )}
                    />
                </div>
            </div>
        </div>
    );
}
