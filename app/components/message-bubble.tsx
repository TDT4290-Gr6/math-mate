import { cn } from '@/lib/utils';

interface ChatMessage {
    chatID: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isLoading?: boolean;
    content: string;
}

interface MessageBubbleProps {
    message: ChatMessage;
}

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
                    'rounded-lg px-4 py-2 break-words',
                    isUser
                        ? 'max-w-[70%] rounded-br-sm bg-[#E6E4E1]'
                        : 'text-gray-900',
                    message.isLoading && 'animate-pulse',
                )}
            >
                {message.content}
            </div>
        </div>
    );
}
