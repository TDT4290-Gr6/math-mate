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

    return (
        <div className="mt-5 flex max-h-92 flex-col-reverse space-y-2 overflow-y-auto rounded-lg">
            {visibleSteps
                .map((step, index) => (
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
                ))
                .reverse()}
        </div>
    );
}
