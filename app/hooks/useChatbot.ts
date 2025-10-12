'use client';

import { useState, useEffect } from 'react';
import { sendMessageAction } from '../actions/sendMessageAction';
import { ChatHistory, ChatMessage } from '@/components/chatbot-window';


// Privacy notice for chat
const PRIVACY_INITIAL_MESSAGE: ChatMessage = {
    chatID: 'privacy-notice',
    sender: 'assistant',
    content:
        "Privacy Notice: Please do not share any personal information in this chat. I'm here to help you with math problems only!",
    timestamp: new Date(),
    className:
        'bg-card border border-[var(--accent)] text-[var(--accent)] mx-5',
};

export function useChatbot() {
    const [chatHistory, setChatHistory] = useState<ChatHistory>({ messages: [PRIVACY_INITIAL_MESSAGE] });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Automatically clear error after 7 seconds
    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(null), 7000);
        return () => clearTimeout(timer);
    }, [error]);

    /**
     * Sends a user message and updates chat history with user and assistant messages.
     */
    const sendMessage = async (message: string) => {
        const userMessage: ChatMessage = {
            chatID: `user-${Date.now()}`,
            sender: 'user',
            content: message,
            timestamp: new Date(),
        };
        setChatHistory(prev => ({
            messages: [...prev.messages, userMessage],
        }));

        setIsLoading(true);
        try {
            const reply = await sendMessageAction(message);
            if (!reply.success) {
                setError(reply.error);
                return;
            }
            const assistantMessage: ChatMessage = {
                chatID: `assistant-${Date.now()}`,
                sender: 'assistant',
                content: reply.message.content,
                timestamp: new Date(),
            };
            setChatHistory(prev => ({
                messages: [...prev.messages, assistantMessage],
            }));
        } catch {
            setError('Failed to get response. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        chatHistory,
        sendMessage,
        isLoading,
        error,
        setError, // expose for optional UI control
    };
}
