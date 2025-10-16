import { LaTeXFormattedText } from './ui/latex-formatted-text';
import type { Step } from '@/entities/models/step';
import { useEffect, useRef } from 'react';
import MethodCard from './ui/method-card';
import { Minus } from 'lucide-react';

interface StepsProps {
    steps?: Array<Step>;
    currentStep: number;
    methodTitle: string | undefined;
    methodDescription: string | undefined;
}

/**
 * Steps
 *
 * Renders a list of solution steps up to `currentStep` and a MethodCard.
 * Automatically scrolls to the bottom when new steps are added or
 * `currentStep` increases so the latest step is visible.
 *
 * Props:
 * @param steps - Array of step objects with id and content
 * @param currentStep - Number of steps to reveal
 * @param methodTitle - Title of the solving method
 * @param methodDescription - Description of the solving method
 */
export default function Steps({
    steps,
    currentStep,
    methodTitle,
    methodDescription,
}: StepsProps) {
    const visibleSteps: Step[] = steps?.slice(0, currentStep) ?? [];
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        // Scroll to bottom when adding new steps
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [visibleSteps.length]);

    return (
        <div
            ref={containerRef}
            className="mt-5 flex h-92 flex-col space-y-2 overflow-y-auto rounded-lg"
        >
            <div className="flex w-full max-w-5xl flex-col px-10 text-sm lg:flex-row">
                <MethodCard
                    title={methodTitle ?? 'Untitled method'}
                    description={
                        methodDescription ?? 'No description available'
                    }
                    buttonText="Get Started"
                    disableButton={true}
                />
            </div>
            {visibleSteps.map((step, index) => (
                <div key={step.id} className="p-2">
                    <h3 className="flex flex-row text-lg font-semibold">
                        <Minus
                            stroke="currentColor"
                            strokeWidth={6}
                            className="mr-2 self-center text-[var(--accent)]"
                        />
                        Step {index + 1}
                    </h3>
                    <LaTeXFormattedText text={step.content} />
                </div>
            ))}
        </div>
    );
}
