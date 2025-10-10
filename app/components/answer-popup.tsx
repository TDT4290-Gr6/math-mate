import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
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
 * @param onClose: Optional callback invoked when the dialog is requested to close
 *          (either by user action or when the component finishes its flow).
 */
interface AnswerPopupProps {
    isOpen: boolean;
    answer: string;
    onClose?: () => void;
}

type Step = 'reveal' | 'confirm' | 'difficulty' | 'done';

export default function AnswerPopup({
    isOpen,
    answer,
    onClose,
}: AnswerPopupProps) {
    /*
    Flow (step states):
         - 'reveal': initial state when the popup opens. Shows a single click-to-reveal field.
             Clicking it advances to 'confirm'. This is a one-way action (not a toggle).
         - 'confirm': shows the revealed answer and asks the user whether their solution
             matched (Yes / No). Selecting either sets `wasCorrect` and moves to 'difficulty'.
         - 'difficulty': user rates how hard the problem was (1..4). The UI highlights
         ratings cumulatively (buttons 1..N). Once a rating is chosen, the footer
             shows 'Try again' and 'Next question' actions; selecting one finishes the flow.
         - 'done': final state after an action; the popup is closed and `onClose` is called.

         Notes:
         - The component resets to 'reveal' whenever `isOpen` becomes true.
         - All state transitions are handled locally; the parent controls visibility
             through `isOpen`/`onClose` so it can reopen the dialog later.
             */
    const [step, setStep] = useState<Step>('reveal');
    const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
        null,
    );
    const [wasCorrect, setWasCorrect] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            setStep('reveal');
            setSelectedDifficulty(null);
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
        // TO-DO: handle difficulty rating answer and decide if a user can re-evaluata a problem
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
                onEscapeKeyDown={(event) => event.preventDefault()} // prevent escape key
                className="px-8 pt-8 pb-4"
            >
                <DialogHeader>
                    <DialogTitle>
                        <Title title="Here's the answer:" />
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex h-40 w-full flex-col items-center justify-between">
                            <div className="flex w-3/4 max-w-sm flex-1 items-center justify-center">
                                {step === 'reveal' && (
                                    <div
                                        role="button"
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
                                        className="w-full cursor-pointer rounded-md border bg-white px-4 py-3 text-center text-gray-400 hover:ring-1 hover:ring-gray-200"
                                        aria-label="Reveal answer"
                                    >
                                        Click to reveal answer
                                    </div>
                                )}

                                {step === 'confirm' && (
                                    <div className="w-full text-center">
                                        <div className="mb-2">
                                            Compare it with your work to see how
                                            close you got.
                                        </div>
                                        <div className="my-3 rounded-md border bg-gray-50 px-4 py-3 text-gray-900">
                                            {answer}
                                        </div>
                                        <div>
                                            Did you arrive at the correct
                                            answer?
                                        </div>
                                    </div>
                                )}

                                {step === 'difficulty' && (
                                    <div className="w-full text-center">
                                        <div className="mb-2 text-sm">
                                            How difficult was this question?
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            {[1, 2, 3, 4, 5].map((n) => {
                                                const isActive =
                                                    selectedDifficulty !==
                                                        null &&
                                                    n <= selectedDifficulty;
                                                return (
                                                    <Button
                                                        key={n}
                                                        onClick={() =>
                                                            handleSelectDifficulty(
                                                                n,
                                                            )
                                                        }
                                                        className={cn(
                                                            'flex-1 rounded-none px-3 py-2',
                                                            isActive
                                                                ? 'bg-accent text-white'
                                                                : 'bg-white text-gray-700',
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
                                        <div className="mb-4 flex flex-row place-content-between px-4 pt-1 text-sm">
                                            <div>Easy</div>
                                            <div>Medium</div>
                                            <div>Hard</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex h-12 w-3/4 max-w-sm items-center justify-center">
                                {step === 'confirm' && (
                                    <div className="flex gap-4">
                                        <Button
                                            className="w-32"
                                            variant="secondary"
                                            onClick={() => handleConfirm(false)}
                                        >
                                            No
                                        </Button>
                                        <Button
                                            className="w-32"
                                            onClick={() => handleConfirm(true)}
                                        >
                                            Yes
                                        </Button>
                                    </div>
                                )}

                                {step === 'difficulty' && (
                                    <div className="flex gap-4">
                                        <Button
                                            variant="secondary"
                                            className="w-32"
                                            disabled={
                                                selectedDifficulty === null
                                            }
                                            onClick={() =>
                                                handleFinalAction('retry')
                                            }
                                        >
                                            Try again
                                        </Button>
                                        <Button
                                            className="w-32"
                                            disabled={
                                                selectedDifficulty === null
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
