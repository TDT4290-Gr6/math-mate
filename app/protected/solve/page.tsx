'use client'

import Steps from "@/components/step"

// Mock steps data for testing
const mockSteps: Step[] = [
    {
        stepID: "step-1",
        content: "First, identify what we need to solve. We have the equation: 2x + 5 = 13"
    },
    {
        stepID: "step-2", 
        content: "Subtract 5 from both sides to isolate the term with x: 2x + 5 - 5 = 13 - 5"
    },
    {
        stepID: "step-3",
        content: "Simplify both sides: 2x = 8"
    },
    {
        stepID: "step-4",
        content: "Divide both sides by 2 to solve for x: 2x ÷ 2 = 8 ÷ 2"
    },
    {
        stepID: "step-5",
        content: "Final answer: x = 4. Let's verify by substituting back: 2(4) + 5 = 8 + 5 = 13 ✓"
    }
];

export default function SolvingPage() {
    return (
        <>
        <Steps steps={mockSteps} currentStep={2}></Steps>
        </>
    )
}
