'use client';

import { useFetchProblem } from 'app/hooks/useFetchProblem';
import ChatbotWindow from '@/components/chatbot-window';
import { motion, AnimatePresence } from 'framer-motion';
import ProblemCard from '@/components/ui/problem-card';
import AnswerPopup from '@/components/answer-popup';
import React, { useEffect, useState } from 'react';
import ChatToggle from '@/components/chat-toggle';
import { useChatbot } from 'app/hooks/useChatbot';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useParams } from 'next/navigation';
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
    const [isAnswerPopupOpen, setIsAnswerPopupOpen] = useState(false);
    const [showToggle, setShowToggle] = useState(true);

    const params = useParams<{ problemId: string; methodId: string }>();
    const problemId = Number(params.problemId);
    const methodId = Number(params.methodId);
    const { problem, loadingProblem, errorProblem } =
        useFetchProblem(problemId);

    const [currentStep, setCurrentStep] = useState(1);

    const method = problem?.methods.find((m) => m.id === methodId);
    const totalSteps = method?.steps?.length ?? 0;

    // Listen for the chat-toggle event
    useEffect(() => {
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
        <div className="flex min-h-screen w-full flex-col items-center">
            <AnswerPopup
                isOpen={isAnswerPopupOpen}
                answer={problem?.solution ?? 'No solution available'}
                onClose={() => setIsAnswerPopupOpen(false)}
            />
            <Header
                variant="problem"
                mathProblem={
                    <div className="flex h-50 flex-row items-center justify-center gap-4">
                        <ProblemCard
                            description={
                                loadingProblem
                                    ? 'Loading problem...'
                                    : errorProblem
                                      ? 'Error loading problem'
                                      : (problem?.problem ??
                                        'No problem available')
                            }
                        />
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
                    <div className="flex-end mt-6 mb-20 flex w-full justify-center gap-10">
                        <Button
                            onClick={() => setIsAnswerPopupOpen(true)}
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
                <AnimatePresence onExitComplete={() => setShowToggle(true)}>
                    {isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 100, y: 180, scale: 0.4 }}
                            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, y: 180, scale: 0.4 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="flex h-full w-1/2 flex-col p-4"
                        >
                            <ChatbotWindow
                                chatHistory={chatHistory}
                                onClose={() => {
                                    setShowToggle(false); // hide toggle immediately
                                    setIsChatOpen(false);
                                }}
                                onSendMessage={sendMessage}
                                isLoading={isLoading}
                                error={error ?? undefined}
                                problemDescription={problem?.problem ?? ''}
                                methodTitle={method?.title}
                                methodDescription={method?.description}
                                steps={method?.steps}
                                currentStep={currentStep}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                {showToggle && !isChatOpen && <ChatToggle />}
            </div>
        </div>
    );
}
