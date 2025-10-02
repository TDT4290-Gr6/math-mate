import { Textarea } from '@/app/components/ui/textarea';
import MessageBubble from './message-bubble';
import { Button } from './ui/button';

interface ChatMessage {
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
    isLoading?: boolean;
    initialMessage?: ChatMessage;
}

export default function ChatbotWindow({
    chatHistory,
    placeholder,
    onSendMessage,
    isLoading,
    initialMessage,
}: ChatbotWindowProps) {
    return (
        <div>
            <div className="flex h-full max-h-120 flex-col-reverse space-y-2 overflow-y-auto">
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
            <div className="grid w-full gap-2">
                <Textarea
                    placeholder={placeholder}
                    className="h-px resize-none"
                />
                <Button>Send message</Button>
            </div>
        </div>
    );
}
