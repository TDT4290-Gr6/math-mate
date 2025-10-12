'use client';

import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import Link from 'next/link';
import Title from '@/components/ui/title';
import ProblemCard from '@/components/ui/problem-card';
import { useState } from 'react';
import ChatbotWindow from '@/components/chatbot-window';
import ChatToggle from '@/components/chat-toggle';

export default function SolveYourself() {
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    return (
        <div className="flex min-h-screen flex-col items-center gap-6">
            <Header />

            <div className="flex w-5/9 justify-start pt-10">
                <Title title={"Solve on your own:"} />
            </div>
            {/* TODO: Replace with question component :) */}
            <ProblemCard description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nunc diam. Fusce accumsan tempor justo ac pellentesque. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
            
            {isChatOpen && (
                <div className="bg-border absolute top-0 bottom-0 left-1/2 w-0.5"></div>
            )}
            {isChatOpen ? (
                <div className="flex h-full w-1/2 flex-col p-4">
                    <ChatbotWindow
                        chatHistory={chatHistory}
                        onClose={() => setIsChatOpen(!isChatOpen)}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        initialMessage={PRIVACY_INITIAL_MESSAGE}
                    />
                </div>
            ) : (
                <ChatToggle />
            )}
            
            {/* TODO: add backend titles and descriptions */}
            <div className="flex flex-row items-center gap-6 mt-6">
                {/* TODO: change link to "method" page */}
                <Link href="/protected/method">
                    <Button
                        variant="default"
                        className="w-40"
                    >
                        Use a step-by-step
                    </Button>
                </Link>
                {/* TODO: change link to "solution" popup */}
                <Link href="/protected/solution">
                    <Button
                        variant="secondary"
                        className="w-40"
                    >
                        Go to answer
                    </Button>
                </Link>
            </div>
        </div>
    );
}
