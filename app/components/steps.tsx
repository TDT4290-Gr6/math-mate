'use client';

import { useTrackedLogger } from '@/components/logger/MethodProvider';
import { useEffect, useRef } from 'react';
import MethodCard from './ui/methodcard';
import { Minus } from 'lucide-react';

interface Step {
    stepID: string;
    content: string;
}

interface StepsProps {
    steps: Array<Step>;
    currentStep: number;
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
 *
 * Logs:
 * - `step_click`: when a user clicks a revealed step.
 * - `step_visible`: when a new step becomes visible (auto event when currentStep changes).
 */
export default function Steps({ steps, currentStep }: StepsProps) {
    const visibleSteps: Step[] = steps.slice(0, currentStep);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const tracked = useTrackedLogger();

    // scroll when new steps appear
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [visibleSteps.length]);

    // log automatically when a new step becomes visible
    useEffect(() => {
        if (currentStep > 0) {
            const newStep = steps[currentStep - 1];
            if (newStep) {
                void tracked.logEvent({
                    actionName: 'step_visible',
                    payload: { stepID: newStep.stepID },
                });
            }
        }
    }, [currentStep, steps, tracked]);

    // log on step click
    const handleStepClick = (step: Step) => {
        void tracked.logEvent({
            actionName: 'step_click',
            payload: { stepID: step.stepID },
            /* stepId: Number(step.stepID), */
        });
    };

    return (
        <div
            ref={containerRef}
            className="mt-5 flex h-92 flex-col space-y-2 overflow-y-auto rounded-lg"
        >
            <div className="flex w-full max-w-5xl flex-col px-10 text-sm lg:flex-row">
                <MethodCard
                    title="Method 1"
                    description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                    buttonText="Get Started"
                    disableButton={true}
                />
            </div>

            {visibleSteps.map((step, index) => (
                <div
                    key={step.stepID}
                    className="p-2"
                    role="button"
                    tabIndex={0}
                    onClick={() => handleStepClick(step)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleStepClick(step);
                        }
                    }}
                >
                    <h3 className="flex flex-row text-lg font-semibold">
                        <Minus
                            stroke="currentColor"
                            strokeWidth={6}
                            className="mr-2 self-center text-[var(--accent)]"
                        />
                        Step {index + 1}
                    </h3>
                    <p className="text-sm">{step.content}</p>
                </div>
            ))}
        </div>
    );
}
