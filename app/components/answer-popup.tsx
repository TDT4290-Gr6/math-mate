import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import Title from './ui/title';

interface AnswerPopupProps {
    isOpen: boolean;
    answer: string;
    onClose?: () => void;
}

type Step = "reveal" | "confirm" | "difficulty" | "done";

export default function AnswerPopup({ isOpen, answer, onClose }: AnswerPopupProps) {
    const [step, setStep] = useState<Step>("reveal");
    const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
    const [wasCorrect, setWasCorrect] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep('reveal');
            setSelectedDifficulty(null);
            setWasCorrect(false);
        }
    }, [isOpen]);

    function handleReveal() {
        if (step === "reveal") setStep("confirm");
    }

    function handleConfirm(correct: boolean) {
        setWasCorrect(correct);
        setStep("difficulty");
    }

    function handleSelectDifficulty(level: number) {
        setSelectedDifficulty(level);
    }

    function handleFinalAction(action: "next" | "retry") {
        // TO-DO: handle difficulty rating answer
        console.log({ wasCorrect, selectedDifficulty, action});
        setStep("done");
        onClose?.();
    }

    return (
        <Dialog open={isOpen} onOpenChange={(next) => { if (!next) onClose?.(); }}>
            <DialogContent
                onInteractOutside={(event) => event.preventDefault()} // prevent click outside
                onEscapeKeyDown={(event) => event.preventDefault()} // prevent escape key
                className="p-8"
            >
                <DialogHeader>
                    <DialogTitle>
                        <Title title="Here's the answer:" />
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col items-center justify-between h-36">
                             {step === "reveal" && (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={handleReveal}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " " ) {
                                            e.preventDefault();
                                            handleReveal();
                                        }
                                    }}
                                    className="w-3/4 max-w-sm rounded-md border mt-7 px-4 py-3 bg-white text-gray-400 cursor-pointer hover:ring-1 hover:ring-gray-200 text-center"
                                    aria-label="Reveal answer"
                                >
                                    Click to reveal answer
                                </div>
                            )}
                            {step === "confirm" && (
                                <div className="w-3/4 max-w-sm text-center">
                                    <p>Compare it with your work to see how close you got.</p>
                                    <div className="rounded-md border px-4 py-3 my-3 bg-gray-50 text-gray-900">
                                        {answer}
                                    </div>
                                    <p>Did you arrive at the correct answer?</p>
                                    <div className="mt-2 flex justify-center gap-4">
                                        <Button className="w-32" variant="secondary" onClick={() => handleConfirm(false)}>
                                            No
                                        </Button>
                                        <Button className="w-32" onClick={() => handleConfirm(true)}>Yes</Button>
                                    </div>
                                </div>
                            )}
                            {step === 'difficulty' && (
                                <div className="w-3/4 max-w-sm text-center">
                                    <div className="mb-4 text-sm">
                                        How difficult was this question?
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        {[1, 2, 3, 4].map((n) => (
                                            <Button
                                                key={n}
                                                onClick={() => handleSelectDifficulty(n)}
                                                className={
                                                    'flex-1 px-3 py-2 border rounded-md focus:outline-none ' +
                                                    (selectedDifficulty === n
                                                        ? 'bg-accent text-white'
                                                        : 'bg-white text-gray-700 hover:ring-1 hover:ring-gray-200')
                                                }
                                                aria-pressed={selectedDifficulty === n}
                                            >
                                                {n}
                                            </Button>
                                        ))}
                                    </div>

                                    <div className="mt-4 flex justify-center gap-4">
                                        <Button
                                            variant="secondary"
                                            className="w-32"
                                            disabled={selectedDifficulty === null}
                                            onClick={() => handleFinalAction('retry')}
                                        >
                                            Try again
                                        </Button>
                                        <Button
                                            className="w-32"
                                            disabled={selectedDifficulty === null}
                                            onClick={() => handleFinalAction('next')}
                                        >
                                            Next question
                                        </Button>
                                    </div>
                                </div>
                            )}
                           
                        </div> 
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
