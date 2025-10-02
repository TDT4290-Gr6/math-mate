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
        <div className="flex max-h-96 flex-col-reverse space-y-2 overflow-y-auto rounded-lg border">
            {visibleSteps
                .map((step, index) => (
                    <div key={step.stepID} className="p-4">
                        <h3 className="mb-2 flex flex-row text-lg font-semibold">
                            <Minus
                                color="#EB5E28"
                                strokeWidth={6}
                                className="mr-2 self-center"
                            />
                            Step {index + 1}
                        </h3>
                        <p>{step.content}</p>
                    </div>
                ))
                .reverse()}
        </div>
    );
}
