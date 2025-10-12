'use client';

import ChatbotWindow from '@/components/chatbot-window';
import ProblemCard from '@/components/ui/problem-card';
import ChatToggle from '@/components/chat-toggle';
import { useChatbot } from 'app/hooks/useChatbot';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useEffect, useState } from 'react';
import Title from '@/components/ui/title';
import Link from 'next/link';
import React from 'react';

/**
 * SolveYourself
 *
 * A high-level page component that displays a math problem for the user to solve,
 * along with an optional chat assistant to provide guidance.
 *
 * Features:
 * - Displays the problem description in a `ProblemCard`.
 * - Shows a step-by-step guide link and solution link.
 * - Integrates a chatbot window (`ChatbotWindow`) that can be toggled open/closed via `ChatToggle`.
 * - Manages chat state using the `useChatbot` hook, including:
 *   - Chat history
 *   - Sending messages
 *   - Loading state
 *   - Error messages
 * - Listens to a custom `chat-toggle` event to open or close the chat.
 *
 * Layout:
 * - If the chat is open, the header displays the problem with the chat window alongside.
 * - If the chat is closed, only the problem card, title, and action buttons are shown.
 * - The chat toggle button floats at the bottom-right of the screen.
 *
 * Hooks used:
 * - `useState` for managing current chat open/closed state.
 * - `useEffect` to listen for chat toggle events and cleanup event listeners.
 * - `useChatbot` to manage chat messages, sending, loading, and errors.
 *
 * Returns:
 * - JSX element rendering the problem-solving page with optional chat support.
 */

export default function SolveYourself() {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const problemDescription =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nunc diam. Fusce accumsan tempor justo ac pellentesque. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

    const { chatHistory, sendMessage, isLoading, error, setError } =
        useChatbot();

    // Listen for the chat-toggle event
    useEffect(() => {
        const handler = () => setIsChatOpen((v) => !v);
        window.addEventListener('chat-toggle', handler as EventListener);
        return () =>
            window.removeEventListener('chat-toggle', handler as EventListener);
    }, []);

    return (
        <div className="${isChatOpen ? '' : 'gap-6'} flex min-h-screen flex-col items-center">
            {isChatOpen ? (
                <Header
                    variant="problem"
                    mathProblem={
                        <ProblemCard description={problemDescription} />
                    }
                />
            ) : (
                <Header variant="simple" />
            )}

            {isChatOpen ? null : (
                <div className={`mt-12 mb-8 flex w-5/9 justify-start`}>
                    <Title title={'Solve on your own:'} />
                </div>
            )}

            {/* TODO: Replace description with actual description :) */}
            {isChatOpen ? null : (
                <ProblemCard description={problemDescription} />
            )}

            {isChatOpen}
            {isChatOpen ? (
                <div className="flex h-full w-3/5 max-w-3/5 flex-col items-center">
                    <ChatbotWindow
                        chatHistory={chatHistory}
                        onClose={() => setIsChatOpen(!isChatOpen)}
                        onSendMessage={sendMessage}
                        isLoading={isLoading}
                        error={error ? error : undefined}
                    />
                </div>
            ) : (
                <div className="fixed right-200 bottom-20">
                    <ChatToggle />
                </div>
            )}

            {/* TODO: add backend titles and descriptions */}
            <div
                className={`${isChatOpen ? '' : 'mt-6'} mb-12 flex flex-row items-center gap-10`}
            >
                {/* TODO: change link to "method" page */}
                <Link href="/protected/method">
                    <Button variant="default" className="w-40">
                        Use a step-by-step
                    </Button>
                </Link>
                {/* TODO: change link to "solution" popup */}
                <Link href="/protected/solution">
                    <Button variant="secondary" className="w-40">
                        Go to answer
                    </Button>
                </Link>
            </div>
        </div>
    );
}
