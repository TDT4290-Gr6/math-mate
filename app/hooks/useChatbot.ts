'use client';

import { ChatHistory, ChatMessage } from '@/components/chatbot-window';
import { useLogger } from '@/components/logger/LoggerProvider';
import { useState, useEffect, useRef } from 'react';
import { sendMessageAction } from '../actions';
import { useSession } from 'next-auth/react';

// Privacy notice for chat - factory function
const createPrivacyMessage = (): ChatMessage => ({
    chatID: 'privacy-notice',
    sender: 'assistant',
    content:
        "Privacy Notice: Please do not share any personal information in this chat. I'm here to help you with math problems only!",
    timestamp: new Date(),
    className:
        'bg-card border border-[var(--accent)] text-[var(--accent)] mx-5',
});

/**
 * useChatbot
 *
 * A custom React hook for managing the state and behavior of a chatbot interface.
 * Provides chat history, loading and error states, and a function to send messages
 * to the server-side chat action.
 *
 * Features:
 * - Initializes chat history with a privacy notice from the assistant.
 * - Tracks messages sent by the user and responses from the assistant.
 * - Provides `isLoading` state for UI feedback while awaiting responses.
 * - Provides `error` state for handling failures in sending or receiving messages.
 * - Automatically clears errors after 7 seconds.
 *
 * Functions:
 * - `sendMessage(message: string)`: Sends a user message to the backend using
 *   `sendMessageAction`, updates the chat history with the user message and
 *   assistant response, and handles errors and loading state.
 *
 * Returns:
 * - `chatHistory: ChatHistory` – The current conversation history, including user
 *    and assistant messages.
 * - `sendMessage: (message: string) => Promise<void>` – Function to send a message
 *    and update chat history.
 * - `isLoading: boolean` – True if a message is being processed, false otherwise.
 * - `error: string | null` – Error message if sending/receiving fails.
 * - `setError: (error: string | null) => void` – Setter to manually update the error state.
 */

export function useChatbot() {
    const { data: session, status } = useSession();
    const logger = useLogger();
    const [chatHistory, setChatHistory] = useState<ChatHistory>({
        messages: [createPrivacyMessage()],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const chatSessionId = useRef(
        `${Date.now()}${Math.floor(Math.random() * 1e6)}`,
    ).current;

    // Automatically clear error after 7 seconds
    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(null), 7000);
        return () => clearTimeout(timer);
    }, [error]);

    useEffect(() => {
        sessionStorage.removeItem('chatSessionId');
    }, []);

    /**
     * Sends a user message and updates chat history with user and assistant messages.
     */
    const sendMessage = async (message: string) => {
        if (status !== 'authenticated' || !session?.user?.id) {
            setError('You must be signed in to chat.');
            return;
        }

        // Add user message to chat history
        const userMessage: ChatMessage = {
            chatID: `user-${Date.now()}`,
            sender: 'user',
            content: message,
            timestamp: new Date(),
        };
        setChatHistory((prev) => ({
            messages: [...prev.messages, userMessage],
        }));

        // Log user message
        const safeMsg = message.slice(0, 500).replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, '[redacted]'); // cap length and strip emails
        void logger.logEvent({
            actionName: 'chat_message_sent',
            payload: { chatSessionId, message: safeMsg },
        });

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
            setChatHistory((prev) => ({
                messages: [...prev.messages, assistantMessage],
            }));

            // Log assistant response
            void logger.logEvent({
                actionName: 'chat_message_received',
                payload: {
                    chatSessionId,
                    reply: reply.message.content,
                },
            });
        } catch (err) {
            console.error('Failed to get response:', err);
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
        setError,
    };
}
