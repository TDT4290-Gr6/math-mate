'use client';

import {
    MethodProvider,
    useTrackedLogger,
} from '@/components/logger/MethodProvider';
import ChatbotWindow from '@/components/chatbot-window';
import ProblemCard from '@/components/ui/problem-card';
import ChatToggle from '@/components/chat-toggle';
import { useChatbot } from 'app/hooks/useChatbot';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import React, { useState } from 'react';
import Steps from '@/components/steps';
import { cn } from '@/lib/utils';

// Define the Step type
interface Step {
    stepID: string;
    content: string;
}

// Mock steps data for testing
const mockSteps: Step[] = [
    {
        stepID: 'step-1',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        stepID: 'step-2',
        content:
            'Subtract 5 from both sides to isolate the term with x: 2x + 5 - 5 = 13 - 5',
    },
    {
        stepID: 'step-3',
        content: 'Simplify both sides: 2x = 8',
    },
    {
        stepID: 'step-4',
        content: 'Divide both sides by 2 to solve for x: 2x ÷ 2 = 8 ÷ 2',
    },
    {
        stepID: 'step-5',
        content:
            "Final answer: x = 4. Let's verify by substituting back: 2(4) + 5 = 8 + 5 = 13 ✓",
    },
];

/**
 * SolvingPage
 *
 * High-level page that shows a math question, step-by-step solution
 * guidance and an optional chat helper. Manages step navigation and
 * chat state and passes messages to the ChatbotWindow.
 */
export default function SolvingPage() {
    const search = useSearchParams();
    const methodIdParam = search?.get?.('methodId');
    const stepIdParam = search?.get?.('stepId');
    const methodId = methodIdParam ? Number(methodIdParam) : undefined;
    const stepId = stepIdParam ? Number(stepIdParam) : undefined;

    return (
        <MethodProvider methodId={methodId} stepId={stepId}>
            <SolvingContent />
        </MethodProvider>
    );
}

function SolvingContent() {
    const tracked = useTrackedLogger();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = mockSteps.length;
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

    const { chatHistory, sendMessage, isLoading, error } = useChatbot();

    // Listen for the chat-toggle event
    React.useEffect(() => {
        const handler = () => {
            setIsChatOpen((v) => {
                const next = !v;
                void tracked.logEvent({
                    actionName: next ? 'chat_open' : 'chat_close',
                });
                return next;
            });
        };
        window.addEventListener('chat-toggle', handler as EventListener);
        return () =>
            window.removeEventListener('chat-toggle', handler as EventListener);
    }, [tracked]);

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            const from = currentStep;
            const to = currentStep + 1;
            setCurrentStep((prev) => prev + 1);
            void tracked.logEvent({
                actionName: 'next_step',
                payload: { from, to },
            });
        }
    };

    const handleGoToAnswer = () => {
        void tracked.logEvent({
            actionName: 'go_to_answer',
            payload: { currentStep },
        });
        alert('Go to answer button clicked');
    };

    return (
        <div className="flex h-screen w-full flex-col items-center">
            <Header
                variant="problem"
                mathProblem={
                    <div className="flex h-50 flex-row items-center justify-center gap-4">
                        <ProblemCard description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nunc diam. Fusce accumsan tempor justo ac pellentesque. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." />
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
                        <Steps steps={mockSteps} currentStep={currentStep} />
                    </div>
                    <div className="flex-end mb-20 flex w-full justify-center gap-2">
                        <Button
                            onClick={() => handleGoToAnswer()}
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
                            onClose={() => {
                                setIsChatOpen(!isChatOpen);
                                void tracked.logEvent({
                                    actionName: 'chat_close',
                                });
                            }}
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
