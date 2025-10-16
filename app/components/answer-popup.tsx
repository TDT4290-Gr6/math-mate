'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { LaTeXFormattedText } from './ui/latex-formatted-text';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Title from './ui/title';

/**
 * Props for the AnswerPopup component.
 *
 * @param isOpen: Controls whether the dialog is visible. The parent typically
 *         manages this boolean so it can open/close the popup.
 * @param answer: The answer text to reveal inside the popup.
 * @param problemId: The ID of the problem being solved, used when recording the solution.
 * @param startedSolvingAt: Timestamp when the user started solving the problem.
 * @param stepsUsed: Number of steps the user took to solve the problem.
 * @param onClose: Optional callback invoked when the dialog is requested to close
 *          (either by user action or when the component finishes its flow).
 */
interface AnswerPopupProps {
    isOpen: boolean;
    answer: string;
    problemId: number;
    startedSolvingAt: Date;
    stepsUsed: number;
    onClose?: () => void;
}

type Step = 'reveal' | 'confirm' | 'difficulty' | 'done';

export default function AnswerPopup({
    isOpen,
    answer,
    problemId,
    startedSolvingAt,
    stepsUsed,
    onClose,
}: AnswerPopupProps) {
    /*
    Flow (step states):
         - 'reveal': initial state when the popup opens. Shows a single click-to-reveal field.
             Clicking it advances to 'confirm'. This is a one-way action (not a toggle).
         - 'confirm': shows the revealed answer and asks the user whether their solution
             matched (Yes / No). Selecting either sets `wasCorrect` and moves to 'difficulty'.
         - 'difficulty': user rates how hard the problem was (1..5). The UI highlights
         ratings cumulatively (buttons 1..N). Once a rating is chosen, the footer
             shows 'Try again' and 'Next question' actions; selecting one finishes the flow.
         - 'done': final state after an action; the popup is closed and `onClose` is called.

         Notes:
         - The component resets to 'reveal' whenever `isOpen` becomes true.
         - All state transitions are handled locally; the parent controls visibility
             through `isOpen`/`onClose` so it can reopen the dialog later.
             */
    const [step, setStep] = useState<Step>('reveal');
    const [selectedDifficulty, setSelectedDifficulty] = useState<
        number | undefined
    >(undefined);
    const [wasCorrect, setWasCorrect] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setStep('reveal');
            setSelectedDifficulty(undefined);
            setWasCorrect(false);
        }
    }, [isOpen]);

    function handleReveal() {
        if (step === 'reveal') setStep('confirm');
    }

    function handleConfirm(correct: boolean) {
        setWasCorrect(correct);
        setStep('difficulty');
    }

    function handleSelectDifficulty(level: number) {
        setSelectedDifficulty(level);
    }

    function handleFinalAction(action: 'next' | 'retry') {
        // TODO: handle difficulty rating answer and decide whether a user can re-evaluate a problem
        console.log({ wasCorrect, selectedDifficulty, action });
        setStep('done');
        if (action === 'next') {
            router.push('/protected/problem');
        }
        onClose?.();
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(next) => {
                if (!next) onClose?.();
            }}
        >
            <DialogContent
                onInteractOutside={(event) => event.preventDefault()} // prevent click outside
                onEscapeKeyDown={() => onClose?.()} // allow Escape to close dialog
                className="px-8 pt-8 pb-4"
            >
                <DialogHeader>
                    <DialogTitle>
                        <Title title="Here's the answer:" />
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex h-44 w-full flex-col items-center justify-start">
                            <div className="flex w-3/4 max-w-sm flex-1">
                                {step === 'reveal' && (
                                    <div className="w-full text-center">
                                        <p className="text-[var(--foreground)]">
                                            Press the square below to see the
                                            solution
                                        </p>
                                        <Button
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
                                        >
                                            Click to reveal answer
                                        </Button>
                                    </div>
                                )}
                                {step === 'confirm' && (
                                    <div className="w-full justify-start text-center">
                                        <p className="text-[var(--foreground)]">
                                            Compare it with your work to see how
                                            close you got.
                                        </p>
                                        <div className="my-3 h-12 rounded-md bg-[var(--answer-card-secondary)] px-4 py-3 text-[var(--secondary-foreground)]">
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
                                {step === 'difficulty' && (
                                    <div className="w-full text-center">
                                        <p className="mb-2 text-sm text-[var(--foreground)]">
                                            How difficult was this question?
                                        </p>
                                        <div className="flex items-center justify-between gap-2">
                                            {[1, 2, 3, 4, 5].map((n) => {
                                                const isActive =
                                                    selectedDifficulty !==
                                                        undefined &&
                                                    n <= selectedDifficulty;
                                                return (
                                                    <Button
                                                        key={n}
                                                        onClick={() =>
                                                            handleSelectDifficulty(
                                                                n,
                                                            )
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
                                                        aria-pressed={isActive}
                                                        aria-label={`Rate difficulty ${n}`}
                                                    >
                                                        {n}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        <div className="mb-4 flex flex-row place-content-between px-4 pt-1 text-sm text-[var(--foreground)]">
                                            <p>Easy</p>
                                            <p>Medium</p>
                                            <p>Hard</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="m-3 flex h-12 w-3/4 max-w-sm items-center justify-center">
                                {step === 'confirm' && (
                                    <div className="flex gap-4">
                                        <Button
                                            className="w-32"
                                            variant="default"
                                            onClick={() => handleConfirm(false)}
                                        >
                                            No
                                        </Button>
                                        <Button
                                            className="w-32"
                                            variant="secondary"
                                            onClick={() => handleConfirm(true)}
                                        >
                                            Yes
                                        </Button>
                                    </div>
                                )}

                                {step === 'difficulty' && (
                                    <div className="flex gap-4">
                                        <Button
                                            variant="default"
                                            className="w-40"
                                            disabled={
                                                selectedDifficulty === undefined
                                            }
                                            onClick={() =>
                                                handleFinalAction('retry')
                                            }
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
