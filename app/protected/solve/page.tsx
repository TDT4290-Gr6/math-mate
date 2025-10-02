'use client';

import { Button } from '@/components/ui/button';
import Steps from '@/components/steps';
import { useState } from 'react';

// Define the Step type
interface Step {
    stepID: string;
    content: string;
}

// Mock steps data for testing
const mockSteps: Step[] = [
    {
        stepID: 'step-1',
        content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        stepID: 'step-2',
        content:
            'Subtract 5 from both sides to isolate the term with x: 2x + 5 - 5 = 13 - 5',
    },
    {
        stepID: 'step-3',
        content: 'Simplify both sides: 2x = 8',
    },
    {
        stepID: 'step-4',
        content: 'Divide both sides by 2 to solve for x: 2x ÷ 2 = 8 ÷ 2',
    },
    {
        stepID: 'step-5',
        content:
            "Final answer: x = 4. Let's verify by substituting back: 2(4) + 5 = 8 + 5 = 13 ✓",
    },
];

export default function SolvingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = mockSteps.length;

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    return (
        <div>
            <div className="h-48 w-full">
                {/* To-do: Add question component */}
                <h2>Question</h2>
            </div>
            <div className="flex w-full flex-row border-t-2">
                {/* mx-auto for when the chat is closed */}
                <div className="flex w-1/2 flex-col items-center gap-2 p-4">
                    <div className="w-full flex-1">
                        <Steps steps={mockSteps} currentStep={currentStep} />
                    </div>
                    <div className="w-full">
                        <Button className="m-1 w-1/4 rounded-full">
                            Go to answer
                        </Button>
                        {currentStep < totalSteps && (
                            <Button
                                onClick={() => handleNextStep()}
                                className="m-1 w-1/4 rounded-full bg-[#EB5E28]"
                            >
                                Next step
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
