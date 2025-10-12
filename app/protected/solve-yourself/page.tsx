'use client';

import ChatbotWindow from '@/components/chatbot-window';
import ProblemCard from '@/components/ui/problem-card';
import ChatToggle from '@/components/chat-toggle';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import Title from '@/components/ui/title';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useChatbot } from 'app/hooks/useChatbot';
import React from 'react';

export default function SolveYourself() {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const problemDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nunc diam. Fusce accumsan tempor justo ac pellentesque. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

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
        <div className="flex min-h-screen flex-col items-center ${isChatOpen ? '' : 'gap-6'}">
            {isChatOpen ? <Header variant='problem' mathProblem={<ProblemCard description={problemDescription} />} /> : <Header variant="simple" />}

            {isChatOpen ? null : (
                <div className={`flex w-5/9 justify-start mt-12 mb-8`}>
                    <Title title={'Solve on your own:'} />
                </div>
            )}

            {/* TODO: Replace description with actual description :) */}
            {isChatOpen ? (
                null
            ) : <ProblemCard description={problemDescription} />}

            {isChatOpen}
            {isChatOpen ? (
                <div className="flex h-full max-w-3/5 w-3/5 items-center flex-col">
                    <ChatbotWindow
                        chatHistory={chatHistory}
                        onClose={() => setIsChatOpen(!isChatOpen)}
                        onSendMessage={sendMessage}
                        isLoading={isLoading}
                        error={error ? error : undefined}
                    />
                </div>
            ) : (
                <div className="fixed bottom-20 right-200">
                    <ChatToggle />
                </div>
            )}

            {/* TODO: add backend titles and descriptions */}
            <div className={`${isChatOpen ? '' : 'mt-6'} flex flex-row items-center gap-10 mb-12`}>
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
