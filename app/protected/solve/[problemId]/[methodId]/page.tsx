'use client';

import { useFetchProblem } from 'app/hooks/useFetchProblem';
import ChatbotWindow from '@/components/chatbot-window';
import ProblemCard from '@/components/ui/problem-card';
import ChatToggle from '@/components/chat-toggle';
import { useChatbot } from 'app/hooks/useChatbot';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import Steps from '@/components/steps';
import { cn } from '@/lib/utils';

/**
 * SolvingPage
 *
 * High-level page that shows a math question, step-by-step solution
 * guidance and an optional chat helper. Manages step navigation and
 * chat state and passes messages to the ChatbotWindow.
 */
export default function SolvingPage() {
    const { chatHistory, sendMessage, isLoading, error } = useChatbot();
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    const params = useParams<{ problemId: string; methodId: string }>();
    const problemId = Number(params.problemId);
    const methodId = Number(params.methodId);
    const { problem, loading } = useFetchProblem(problemId);

    const [currentStep, setCurrentStep] = useState(1);

    const method = problem?.methods.find((m) => m.id === methodId);
    const totalSteps = method?.steps?.length ?? 0;

    // Listen for the chat-toggle event
    React.useEffect(() => {
        const handler = () => setIsChatOpen((v) => !v);
        window.addEventListener('chat-toggle', handler as EventListener);
        return () =>
            window.removeEventListener('chat-toggle', handler as EventListener);
    }, []);

    const handleNextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col items-center">
            <Header
                variant="problem"
                mathProblem={
                    <div className="flex h-50 flex-row items-center justify-center gap-4">
                        <ProblemCard description={problem?.problem} />
                    </div>
                }
            />

            <div className="relative flex h-full w-full flex-1 overflow-hidden">
                <div
                    className={cn(
                        'flex h-full flex-col items-center justify-between p-4',
                        isChatOpen ? 'w-1/2' : 'mx-auto w-3/5',
                    )}
                >
                    <div className="h-full w-full flex-1">
                        <Steps
                            steps={method?.steps}
                            currentStep={currentStep}
                            methodTitle={method?.title}
                            methodDescription={method?.description}
                        />
                    </div>
                    <div className="flex-end mb-20 flex w-full justify-center gap-2">
                        <Button
                            onClick={() => alert('Go to answer button clicked')}
                            className="w-1/4 rounded-full"
                            variant="default"
                        >
                            Go to answer
                        </Button>
                        {currentStep < totalSteps && (
                            <Button
                                onClick={() => handleNextStep()}
                                className="w-1/4 rounded-full"
                                variant="secondary"
                            >
                                Next step
                            </Button>
                        )}
                    </div>
                </div>
                {isChatOpen && (
                    <div className="bg-border absolute top-0 bottom-0 left-1/2 w-[1px]"></div>
                )}
                {isChatOpen ? (
                    <div className="flex h-full w-1/2 flex-col p-4">
                        <ChatbotWindow
                            chatHistory={chatHistory}
                            onClose={() => setIsChatOpen(!isChatOpen)}
                            onSendMessage={sendMessage}
                            isLoading={isLoading}
                            error={error ?? undefined}
                        />
                    </div>
                ) : (
                    <ChatToggle />
                )}
            </div>
        </div>
    );
}
