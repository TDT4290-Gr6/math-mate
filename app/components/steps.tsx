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

export default function Steps({ steps, currentStep }: StepsProps) {
    const visibleSteps: Step[] = steps.slice(0, currentStep);
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
            className="mt-5 flex max-h-92 flex-col space-y-2 overflow-y-auto rounded-lg"
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
                <div key={step.stepID} className="p-2">
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
