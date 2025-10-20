'use client';

import { useTrackedLogger } from '@/components/logger/LoggerProvider';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFetchProblem } from 'app/hooks/useFetchProblem';
import ChatbotWindow from '@/components/chatbot-window';
import { motion, AnimatePresence } from 'framer-motion';
import ProblemCard from '@/components/ui/problem-card';
import AnswerPopup from '@/components/answer-popup';
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
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAnswerPopupOpen, setIsAnswerPopupOpen] = useState(false);
    const [showToggle, setShowToggle] = useState(true);
    const [dividerPosition, setDividerPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const [chatClosed, setChatClosed] = useState(!isChatOpen);
    const [startedSolvingAt, setStartedSolvingAt] = useState(new Date());

    const tracked = useTrackedLogger();
    const params = useParams<{ problemId: string; methodId: string }>();
    const problemId = Number(params.problemId);
    const methodId = Number(params.methodId);

    const { problem, loadingProblem, errorProblem } =
        useFetchProblem(problemId);

    const [currentStep, setCurrentStep] = useState(0);
    const method = problem?.methods.find((m) => m.id === methodId);
    const totalSteps = method?.steps?.length ?? 0;

    // Handle drag events (Pointer Events for mouse + touch)
    const handlePointerDown = useCallback(
        (e: React.PointerEvent<HTMLElement>) => {
            e.currentTarget.setPointerCapture?.(e.pointerId);
            document.body.style.userSelect = 'none';
            isDragging.current = true;
        },
        [],
    );

    const handlePointerUp = useCallback(() => {
        isDragging.current = false;
        document.body.style.userSelect = '';
    }, []);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!isDragging.current || !containerRef.current) return;
        requestAnimationFrame(() => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX;
            const pct = ((x - rect.left) / rect.width) * 100;
            setDividerPosition(Math.min(70, Math.max(30, pct)));
        });
    }, []);

    useEffect(() => {
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [handlePointerMove, handlePointerUp]);

    useEffect(() => {
        if (isChatOpen) setChatClosed(false);
    }, [isChatOpen]);

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            void tracked.logEvent({
                actionName: 'next_step',
                payload: { total_steps: totalSteps },
                stepId: nextStep,
            });
        }
    };

    const handleGoToAnswer = () => {
        setIsAnswerPopupOpen(true);
        void tracked.logEvent({
            actionName: 'go_to_answer',
            stepId: currentStep,
            payload: { total_steps: totalSteps },
        });
    };

    // Open chat and log
    const handleOpenChat = () => {
        setIsChatOpen(true);
        void tracked.logEvent({ actionName: 'chat_open', payload: {} });
    };

    // Close chat and log
    const handleCloseChat = () => {
        setIsChatOpen(false);
        void tracked.logEvent({ actionName: 'chat_close', payload: {} });
    };

    const handlePopUpClose = () => {
        void tracked.logEvent({ actionName: 'close_answer_popup', payload: {} });
        setIsAnswerPopupOpen(false);
        setStartedSolvingAt(new Date());
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center">
            <AnswerPopup
                isOpen={isAnswerPopupOpen}
                answer={problem?.solution ?? 'No solution available'}
                problemId={problemId}
                startedSolvingAt={startedSolvingAt}
                stepsUsed={currentStep}
                onClose={handlePopUpClose}
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

            <div
                ref={containerRef}
                className="relative flex h-full w-full flex-1 overflow-hidden"
            >
                <div
                    className={cn(
                        'flex h-full flex-col items-center justify-between p-4',
                        chatClosed && 'mx-auto',
                    )}
                    style={{ width: `${isChatOpen ? dividerPosition : 60}%` }}
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
                            onClick={handleGoToAnswer}
                            className="w-40 rounded-full"
                            variant="default"
                        >
                            Go to answer
                        </Button>
                        {currentStep < totalSteps && (
                            <Button
                                onClick={handleNextStep}
                                className="w-40 rounded-full"
                                variant="secondary"
                            >
                                Next step
                            </Button>
                        )}
                    </div>
                </div>

                {/* Draggable Divider */}

                {isChatOpen && (
                    <button
                        type="button"
                        aria-label="Resize chat window"
                        onKeyDown={(e) => {
                            switch (e.key) {
                                case 'ArrowLeft':
                                    setDividerPosition((v) =>
                                        Math.max(30, v - 2),
                                    );
                                    e.preventDefault();
                                    break;
                                case 'ArrowRight':
                                    setDividerPosition((v) =>
                                        Math.min(70, v + 2),
                                    );
                                    e.preventDefault();
                                    break;
                            }
                        }}
                        onPointerDown={handlePointerDown}
                        className="bg-border hover:bg-primary focus-visible:bg-primary absolute top-0 bottom-0 z-20 w-[4px] cursor-col-resize transition-colors focus-visible:outline-none"
                        style={{ left: `${dividerPosition}%` }}
                    />
                )}

                <AnimatePresence
                    onExitComplete={() => {
                        setShowToggle(true);
                        setChatClosed(true);
                    }}
                >
                    {isChatOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: 300, y: 200, scale: 0.4 }}
                            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 300, y: 200, scale: 0.4 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="flex h-full flex-col p-4"
                            style={{
                                width: `${100 - dividerPosition}%`,
                                position: 'absolute',
                                left: `${dividerPosition}%`,
                            }}
                        >
                            <ChatbotWindow
                                chatHistory={chatHistory}
                                onClose={() => {
                                    setShowToggle(false);
                                    setIsChatOpen(false);
                                    handleCloseChat();
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
                {showToggle && !isChatOpen && (
                    <ChatToggle onClick={handleOpenChat} />
                )}
            </div>
        </div>
    );
}
