import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Title from "./ui/title";
import { cn } from "@/lib/utils";

interface AnswerPopupProps {
    isOpen: boolean;
    answer: string;
    onClose?: () => void;
}

type Step = "reveal" | "confirm" | "difficulty" | "done";

export default function AnswerPopup({
    isOpen,
    answer,
    onClose,
}: AnswerPopupProps) {
    const [step, setStep] = useState<Step>("reveal");
    const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(
        null,
    );
    const [wasCorrect, setWasCorrect] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setStep("reveal");
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
        console.log({ wasCorrect, selectedDifficulty, action });
        setStep("done");
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
                className="p-8"
            >
                <DialogHeader>
                    <DialogTitle>
                        <Title title="Here's the answer:" />
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex h-36 flex-col items-center justify-between">
                            {step === "reveal" && (
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={handleReveal}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            e.preventDefault();
                                            handleReveal();
                                        }
                                    }}
                                    className="mt-7 w-3/4 max-w-sm cursor-pointer rounded-md border bg-white px-4 py-3 text-center text-gray-400 hover:ring-1 hover:ring-gray-200"
                                    aria-label="Reveal answer"
                                >
                                    Click to reveal answer
                                </div>
                            )}
                            {step === "confirm" && (
                                <div className="w-3/4 max-w-sm text-center">
                                    <p>
                                        Compare it with your work to see how
                                        close you got.
                                    </p>
                                    <div className="my-3 rounded-md border bg-gray-50 px-4 py-3 text-gray-900">
                                        {answer}
                                    </div>
                                    <p>Did you arrive at the correct answer?</p>
                                    <div className="mt-2 flex justify-center gap-4">
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
                                </div>
                            )}
                            {step === "difficulty" && (
                                <div className="w-3/4 max-w-sm text-center">
                                    <p className="mb-2">
                                        How difficult was this question?
                                    </p>
                                    <div className="flex items-center justify-between gap-1 px-4 py-3">
                                        {[1, 2, 3, 4, 5].map((n) => {
                                            const isActive =
                                                selectedDifficulty !== null &&
                                                n <= selectedDifficulty;
                                            return (
                                                <Button
                                                    key={n}
                                                    onClick={() => handleSelectDifficulty(n)}
                                                    className={cn(
                                                        "flex-1 h-8 focus:outline-none",
                                                        isActive
                                                            ? "bg-accent"
                                                            : "bg-card",
                                                        n === 1 &&
                                                            "rounded-l-full",
                                                        n === 5 &&
                                                            "rounded-r-full",
                                                        n !== 1 &&
                                                            n !== 5 &&
                                                            "rounded-none",
                                                    )}
                                                    aria-pressed={isActive}
                                                    aria-label={`Rate difficulty ${n}`}
                                                >
                                                    {n}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                    <p>Good job! Let&apos;s do another one!</p>
                                    <div className="mt-2 flex justify-center gap-4">
                                        <Button
                                            variant="secondary"
                                            className="w-32"
                                            disabled={
                                                selectedDifficulty === null
                                            }
                                            onClick={() =>
                                                handleFinalAction("retry")
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
                                                handleFinalAction("next")
                                            }
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
