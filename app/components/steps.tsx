'use client';

import { LaTeXFormattedText } from './ui/latex-formatted-text';
import { useEffect, useRef, useState } from 'react';
import type { Step } from '@/entities/models/step';
import MethodCard from './ui/method-card';
import { Minus } from 'lucide-react';

interface StepsProps {
    steps?: Array<Step>;
    currentStep: number;
    methodTitle: string | undefined;
    methodDescription: string | undefined;
}

export default function Steps({
    steps,
    currentStep,
    methodTitle,
    methodDescription,
}: StepsProps) {
    const visibleSteps: Step[] = steps?.slice(0, currentStep) ?? [];
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [announcement, setAnnouncement] = useState('');
    const previousStepCount = useRef(visibleSteps.length);

    // Scroll and announce when new steps appear
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        // Scroll to new step
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });

        // Announce new step to screen readers
        if (
            visibleSteps.length > previousStepCount.current &&
            visibleSteps.length > 0
        ) {
            const newStep = visibleSteps[visibleSteps.length - 1];
            const stepNumber = visibleSteps.length;

            // Clear and set announcement to trigger screen reader
            setAnnouncement('');
            setTimeout(() => {
                setAnnouncement(`Step ${stepNumber}: ${newStep.content}`);
            }, 100);
        }

        previousStepCount.current = visibleSteps.length;
    }, [visibleSteps.length]);

    return (
        <>
            {/* Screen reader live region */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {announcement}
            </div>

            <div
                ref={containerRef}
                className="mt-5 flex h-92 flex-col space-y-2 overflow-y-auto rounded-lg"
                aria-label="Solution steps"
            >
                <div className="flex w-full max-w-5xl flex-col text-sm lg:flex-row">
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
                    <div
                        key={step.id}
                        className="p-2"
                        role="article"
                        aria-label={`Step ${index + 1}`}
                    >
                        <h3 className="flex flex-row text-lg font-semibold">
                            <Minus
                                stroke="currentColor"
                                strokeWidth={6}
                                className="mr-2 self-center text-[var(--accent)]"
                                aria-hidden="true"
                            />
                            Step {index + 1}
                        </h3>
                        <LaTeXFormattedText text={step.content} />
                    </div>
                ))}
            </div>
        </>
    );
}
