import { ChevronDown, SendHorizontal } from 'lucide-react';
import MessageBubble from './message-bubble';
import { useState } from 'react';

export interface ChatMessage {
    chatID: string;
    sender: 'user' | 'bot';
    content: string;
    timestamp: Date;
    isLoading?: boolean;
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

    const handleSendMessage = () => {
        if (inputValue.trim() && onSendMessage) {
            onSendMessage(inputValue.trim());
            setInputValue('');
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
                {onClose && (
                    <ChevronDown
                        onClick={onClose}
                        color="#000000"
                        strokeWidth={2.25}
                    />
                )}
            </div>
            <div className="flex h-full max-h-80 flex-col-reverse space-y-2 overflow-y-auto">
                {initialMessage && (
                    <MessageBubble
                        key={initialMessage.chatID}
                        message={initialMessage}
                    />
                )}
                {chatHistory.messages.map((msg) => (
                    <MessageBubble key={msg.chatID} message={msg} />
                ))}
            </div>
            <div className="flex w-full p-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || 'Type a message...'}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-12 text-sm focus:border-transparent focus:ring-2 focus:ring-[#EB5E28] focus:outline-none"
                    />
                    <SendHorizontal
                        onClick={handleSendMessage}
                        color="#3D3C3A"
                        strokeWidth={2.5}
                        size={20}
                        className="hover:color-[#d54e20] absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}
