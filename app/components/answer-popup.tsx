'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { LaTeXFormattedText } from './latex-formatted-text';
import { useTrackedLogger } from './logger/LoggerProvider';
import { cn, extractPlainTextMath } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { addSolvedProblem } from '@/actions';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Title from './title';

interface AnswerPopupProps {
    isOpen: boolean;
    answer: string;
    problemId: number;
    startedSolvingAt: Date;
    stepsUsed: number;
    onClose?: () => void;
}

type Step = 'reveal' | 'confirm' | 'difficulty' | 'done';

/**
 * AnswerPopup component for displaying a problem's answer and capturing user feedback.
 *
 * This component guides the user through multiple steps:
 * 1. **Reveal**: User presses a button to reveal the answer.
 * 2. **Confirm**: User confirms whether their solution was correct.
 * 3. **Difficulty**: User rates the difficulty of the problem from 1 (easy) to 5 (hard).
 * 4. **Done**: Submission is recorded and optionally navigates to the next problem.
 *
 * Accessibility features:
 * - Uses `aria-live` regions to announce actions and results to screen readers.
 * - Focus is managed for each step to improve keyboard navigation.
 *
 * Props:
 * @param isOpen Whether the popup is currently open.
 * @param answer The LaTeX-formatted answer to display.
 * @param problemId The unique ID of the problem.
 * @param startedSolvingAt Date when the user started solving the problem.
 * @param stepsUsed Number of steps the user took while solving.
 * @param onClose Optional callback invoked when the popup is closed.
 *
 * Usage example:
 * ```tsx
 * <AnswerPopup
 *   isOpen={showPopup}
 *   answer="x = 5"
 *   problemId={123}
 *   startedSolvingAt={new Date()}
 *   stepsUsed={3}
 *   onClose={() => setShowPopup(false)}
 * />
 * ```
 */
export default function AnswerPopup({
    isOpen,
    answer,
    problemId,
    startedSolvingAt,
    stepsUsed,
    onClose,
}: AnswerPopupProps) {
    const [step, setStep] = useState<Step>('reveal');
    const [selectedDifficulty, setSelectedDifficulty] = useState<
        number | undefined
    >(undefined);
    const [wasCorrect, setWasCorrect] = useState(false);
    const [finishedSolvingAt, setFinishedSolvingAt] = useState<
        Date | undefined
    >(undefined);
    const [announcement, setAnnouncement] = useState('');

    const router = useRouter();
    const tracked = useTrackedLogger();
    const revealButtonRef = useRef<HTMLButtonElement>(null);
    const confirmYesButtonRef = useRef<HTMLButtonElement>(null);
    const difficultyContainerRef = useRef<HTMLDivElement>(null);

    // Reset state when popup opens - DO NOT announce answer here
    useEffect(() => {
        if (isOpen) {
            setStep('reveal');
            setSelectedDifficulty(undefined);
            setWasCorrect(false);
            setAnnouncement('');

            // Only announce that popup is open, NOT the answer
            setTimeout(() => {
                setAnnouncement(
                    'Answer popup opened. Press the button to reveal the answer.',
                );
            }, 300);
        }
    }, [isOpen]);

    // Handle step changes and focus management
    useEffect(() => {
        if (!isOpen) return;

        switch (step) {
            case 'reveal':
                // Focus on reveal button, but don't announce answer
                setTimeout(() => {
                    revealButtonRef.current?.focus();
                }, 100);
                break;
            case 'confirm':
                // ONLY NOW announce the answer (after user clicked reveal)
                setAnnouncement('');
                setTimeout(() => {
                    const plainAnswer = extractPlainTextMath(answer);
                    setAnnouncement(
                        `Answer revealed: ${plainAnswer}. Did you arrive at the correct answer?`,
                    );
                    confirmYesButtonRef.current?.focus();
                }, 100);
                break;
            case 'difficulty':
                setAnnouncement('');
                setTimeout(() => {
                    setAnnouncement(
                        'How difficult was this question? Rate from 1 (easy) to 5 (hard).',
                    );
                    difficultyContainerRef.current?.focus();
                }, 100);
                break;
        }
    }, [step, isOpen, answer]);

    function handleReveal() {
        if (step === 'reveal') setStep('confirm');
        setFinishedSolvingAt(new Date());
        void tracked.logEvent({
            actionName: 'reveal_answer',
            payload: {},
        });
    }

    function handleConfirm(correct: boolean) {
        setWasCorrect(correct);
        setStep('difficulty');

        setAnnouncement('');
        setTimeout(() => {
            setAnnouncement(
                correct
                    ? 'You answered correctly!'
                    : 'Your answer was incorrect.',
            );
        }, 100);

        void tracked.logEvent({
            actionName: 'answer_evaluation',
            payload: { correct },
        });
    }

    function handleDifficulty(level: number) {
        setSelectedDifficulty(level);

        setAnnouncement('');
        setTimeout(() => {
            const difficultyText =
                level <= 2 ? 'easy' : level <= 3 ? 'medium' : 'hard';
            setAnnouncement(
                `Difficulty rated as ${level} out of 5, ${difficultyText}.`,
            );
        }, 100);
    }

    async function handleFinalAction(action: 'next' | 'retry') {
        try {
            await addSolvedProblem(
                problemId,
                stepsUsed,
                startedSolvingAt,
                finishedSolvingAt,
                selectedDifficulty,
                wasCorrect,
            );
        } catch (error) {
            console.error('Failed to record solved problem:', error);
        }

        setStep('done');
        if (selectedDifficulty != undefined) {
            void tracked.logEvent({
                actionName: 'rate_difficulty',
                payload: { rating: selectedDifficulty },
            });
        }
        if (action === 'next') {
            router.push('/protected/problem');
        }
        handleClose();
    }

    function handleOpen() {
        setStep('reveal');
        setSelectedDifficulty(undefined);
        setWasCorrect(false);
        void tracked.logEvent({ actionName: 'open_answer_popup', payload: {} });
    }

    function handleClose() {
        void tracked.logEvent({
            actionName: 'close_answer_popup',
            payload: {},
        });
        onClose?.();
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(next) => {
                if (next) handleOpen();
                else handleClose();
            }}
        >
            <DialogContent
                onInteractOutside={(event) => event.preventDefault()}
                className="px-8 pt-8 pb-4"
                aria-describedby="answer-popup-description"
            >
                {/* Screen reader announcements - CRITICAL: Only announces after user action */}
                <div
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                >
                    {announcement}
                </div>

                <DialogHeader>
                    <DialogTitle>
                        <Title title="Here's the answer:" />
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div
                            id="answer-popup-description"
                            className="flex h-44 w-full flex-col items-center justify-start"
                        >
                            <div className="flex w-3/4 max-w-sm flex-1">
                                {/* REVEAL STEP */}
                                {step === 'reveal' && (
                                    <div className="w-full text-center">
                                        <p className="text-[var(--foreground)]">
                                            Press the square below to see the
                                            solution
                                        </p>
                                        <Button
                                            ref={revealButtonRef}
                                            tabIndex={0}
                                            onClick={handleReveal}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === 'Enter' ||
                                                    e.key === ' '
                                                ) {
                                                    e.preventDefault();
                                                    handleReveal();
                                                }
                                            }}
                                            className="my-3 h-12 w-full rounded-md bg-[var(--answer-card)] py-3 text-[var(--secondary-foreground)]"
                                            aria-label="Click to reveal the answer"
                                        >
                                            Click to reveal answer
                                        </Button>
                                    </div>
                                )}

                                {/* CONFIRM STEP - Answer is visible but NOT auto-announced */}
                                {step === 'confirm' && (
                                    <div className="w-full justify-start text-center">
                                        <p className="text-[var(--foreground)]">
                                            Compare it with your work to see how
                                            close you got.
                                        </p>
                                        <div
                                            className="my-3 h-12 rounded-md bg-[var(--answer-card-secondary)] px-4 py-3 text-[var(--secondary-foreground)]"
                                            role="region"
                                            aria-label="Revealed answer"
                                            // NO aria-live here - answer is only announced via the announcement state
                                        >
                                            <LaTeXFormattedText
                                                text={
                                                    (answer.startsWith('$')
                                                        ? ''
                                                        : '$') +
                                                    answer +
                                                    (answer.endsWith('$')
                                                        ? ''
                                                        : '$')
                                                }
                                            />
                                        </div>
                                        <p className="text-[var(--foreground)]">
                                            Did you arrive at the correct
                                            answer?
                                        </p>
                                    </div>
                                )}

                                {/* DIFFICULTY STEP */}
                                {step === 'difficulty' && (
                                    <div className="w-full text-center">
                                        <p
                                            className="mb-2 text-sm text-[var(--foreground)]"
                                            id="difficulty-label"
                                        >
                                            How difficult was this question?
                                        </p>
                                        <div
                                            ref={difficultyContainerRef}
                                            className="flex items-center justify-between gap-2"
                                            role="radiogroup"
                                            aria-labelledby="difficulty-label"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (
                                                    e.key === 'ArrowLeft' &&
                                                    selectedDifficulty &&
                                                    selectedDifficulty > 1
                                                ) {
                                                    handleDifficulty(
                                                        selectedDifficulty - 1,
                                                    );
                                                    e.preventDefault();
                                                } else if (
                                                    e.key === 'ArrowRight' &&
                                                    selectedDifficulty &&
                                                    selectedDifficulty < 5
                                                ) {
                                                    handleDifficulty(
                                                        selectedDifficulty + 1,
                                                    );
                                                    e.preventDefault();
                                                } else if (
                                                    e.key >= '1' &&
                                                    e.key <= '5'
                                                ) {
                                                    handleDifficulty(
                                                        parseInt(e.key),
                                                    );
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            {[1, 2, 3, 4, 5].map((n) => {
                                                const isActive =
                                                    selectedDifficulty !==
                                                        undefined &&
                                                    n <= selectedDifficulty;
                                                const difficultyLabel =
                                                    n <= 2
                                                        ? 'easy'
                                                        : n === 3
                                                          ? 'medium'
                                                          : 'hard';
                                                return (
                                                    <Button
                                                        key={n}
                                                        onClick={() =>
                                                            handleDifficulty(n)
                                                        }
                                                        variant={
                                                            isActive
                                                                ? 'secondary'
                                                                : 'default'
                                                        }
                                                        className={cn(
                                                            'flex-1 rounded-none px-3 py-2',
                                                            n === 1 &&
                                                                'rounded-l-full',
                                                            n === 5 &&
                                                                'rounded-r-full',
                                                        )}
                                                        role="radio"
                                                        aria-checked={
                                                            n ===
                                                            selectedDifficulty
                                                        }
                                                        aria-label={`Rate difficulty ${n} out of 5, ${difficultyLabel}`}
                                                        tabIndex={-1}
                                                    >
                                                        {n}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        <div className="mb-4 flex flex-row place-content-between px-4 pt-1 text-sm text-[var(--foreground)]">
                                            <p aria-hidden="true">Easy</p>
                                            <p aria-hidden="true">Medium</p>
                                            <p aria-hidden="true">Hard</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="m-3 flex h-12 w-3/4 max-w-sm items-center justify-center">
                                {step === 'confirm' && (
                                    <div
                                        className="flex gap-4"
                                        role="group"
                                        aria-label="Answer confirmation"
                                    >
                                        <Button
                                            className="w-32"
                                            variant="default"
                                            onClick={() => handleConfirm(false)}
                                            aria-label="No, my answer was incorrect"
                                        >
                                            No
                                        </Button>
                                        <Button
                                            ref={confirmYesButtonRef}
                                            className="w-32"
                                            variant="secondary"
                                            onClick={() => handleConfirm(true)}
                                            aria-label="Yes, my answer was correct"
                                        >
                                            Yes
                                        </Button>
                                    </div>
                                )}

                                {step === 'difficulty' && (
                                    <div
                                        className="flex gap-4"
                                        role="group"
                                        aria-label="Next actions"
                                    >
                                        <Button
                                            variant="default"
                                            className="w-40"
                                            disabled={
                                                selectedDifficulty === undefined
                                            }
                                            onClick={() =>
                                                handleFinalAction('retry')
                                            }
                                            aria-label="Try this problem again"
                                        >
                                            Try again
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="w-40"
                                            disabled={
                                                selectedDifficulty === undefined
                                            }
                                            onClick={() =>
                                                handleFinalAction('next')
                                            }
                                            aria-label="Move to next question"
                                        >
                                            Next question
                                        </Button>
                                    </div>
                                )}
                                {step === 'reveal' && (
                                    <div className="w-full" />
                                )}
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
