'use client';

import ChatbotWindow, {
    ChatHistory,
    ChatMessage,
} from '@/components/chatbot-window';
import { useProblemStore } from 'app/store/problem-store';
import ProblemCard from '@/components/ui/problem-card';
import React, { use, useEffect, useState } from 'react';
import ChatToggle from '@/components/chat-toggle';
import { Button } from '@/components/ui/button';
import { sendMessageAction } from '../actions';
import Header from '@/components/ui/header';
import Steps from '@/components/steps';
import { cn } from '@/lib/utils';

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

/**
 * SolvingPage
 *
 * High-level page that shows a math question, step-by-step solution
 * guidance and an optional chat helper. Manages step navigation and
 * chat state and passes messages to the ChatbotWindow.
 */
export default function SolvingPage({
    params,
}: {
    params: Promise<{ methodId: string }>;
}) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = React.useState<ChatHistory>({
        messages: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const problem = useProblemStore((state) => state.problem);
    const { methodId } = use(params);
    const methodIdNumber = Number(methodId);
    const method = problem?.methods.find(m => m.id === methodIdNumber);;
    const totalSteps = (method?.steps?.length) ?? 0;

    // Listen for the chat-toggle event
    React.useEffect(() => {
        const handler = () => setIsChatOpen((v) => !v);
        window.addEventListener('chat-toggle', handler as EventListener);
        return () =>
            window.removeEventListener('chat-toggle', handler as EventListener);
    }, []);

    // Clear error message after 7 seconds
    useEffect(() => {
        if (!error) return;
        const timer = setTimeout(() => setError(null), 7000);
        return () => clearTimeout(timer);
    }, [error]);

    const handleNextStep = () => {
        if (currentStep < totalSteps-1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    /**
     * Handles sending a message from the user to the chat service and updating the chat UI.
     * It handle the loading state and appends both user and assistant messages to the chat history.
     *
     * @param {string} message - The content of the message to send.
     */
    const handleSendMessage = async (message: string) => {
        const userMessage: ChatMessage = {
            chatID: `user-${Date.now()}`,
            sender: 'user',
            content: message,
            timestamp: new Date(),
        };
        setChatHistory((prev) => ({
            messages: [...prev.messages, userMessage],
        }));

        setIsLoading(true);
        try {
            const reply = await sendMessageAction(message);
            if (reply.success === false) {
                setError(reply.error);
                setIsLoading(false);
                return;
            } else {
                const assistantMessage: ChatMessage = {
                    chatID: `assistant-${Date.now()}`,
                    sender: 'assistant',
                    content: reply.message.content,
                    timestamp: new Date(),
                };
                setChatHistory((prev) => ({
                    messages: [...prev.messages, assistantMessage],
                }));
            }
        } catch (error) {
            console.log(error);
            setError('Failed to get response. Please try again.');
        } finally {
            setIsLoading(false);
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
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                            error={error ? error : undefined}
                            initialMessage={PRIVACY_INITIAL_MESSAGE}
                        />
                    </div>
                ) : (
                    <ChatToggle />
                )}
            </div>
        </div>
    );
}
