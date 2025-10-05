'use client';

import ChatbotWindow, { ChatHistory, ChatMessage } from '@/components/chatbot-window';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import Steps from '@/components/steps';
import { cn } from '@/lib/utils';
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

const mochChatHistory: ChatHistory = {
    messages: [
        {
            chatID: '1',
            sender: 'bot',
            timestamp: new Date(),
            content:
                'Lorem isum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            chatID: '2',
            sender: 'user',
            timestamp: new Date(),
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            chatID: '3',
            sender: 'bot',
            timestamp: new Date(),
            content:
                'Lorem ipsum dolor sit amet,consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            chatID: '4',
            sender: 'user',
            timestamp: new Date(),
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
        {
            chatID: '5',
            sender: 'bot',
            timestamp: new Date(),
            content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        },
    ],
};

export default function SolvingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = mockSteps.length;
    const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<ChatHistory>(mochChatHistory);
    const [isLoading, setIsLoading] = useState(false);

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleSendMessage = async (message: string) => {

        const userMessage: ChatMessage = {
            chatID: `user-${Date.now()}`,
            sender: "user",
            content: message,
            timestamp: new Date(),
        }

        setChatHistory(prev => ({
            messages: [...prev.messages, userMessage]
        }))
        
        setIsLoading(true)
        try {
            /* TO-DO: implement API call to get reponse for chatbot */
        }
        catch(error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <div className="h-48 w-full">
                {/* To-do: Add question card */}
                <h2>Question</h2>
            </div>
            <div className="flex h-[calc(100vh-14rem)] w-full border-t-2">
                <div
                    className={cn(
                        'flex flex-col items-center p-4',
                        isChatOpen ? 'w-1/2 border-x-2' : 'mx-auto w-3/5',
                    )}
                >
                    <div className="w-full flex-1">
                        <Steps steps={mockSteps} currentStep={currentStep} />
                    </div>
                    <div className="mt-4 flex w-full justify-center gap-2">
                        <Button className="w-1/4 rounded-full">
                            Go to answer
                        </Button>
                        {currentStep < totalSteps && (
                            <Button
                                onClick={() => handleNextStep()}
                                className="w-1/4 rounded-full bg-[#EB5E28]"
                                
                            >
                                Next step
                            </Button>
                        )}
                    </div>
                </div>
                {isChatOpen ? (
                    <div className="flex w-1/2 flex-col p-4">
                        <ChatbotWindow
                            chatHistory={chatHistory}
                            onClose={() => setIsChatOpen(!isChatOpen)}
                            onSendMessage={handleSendMessage}
                            isLoading={isLoading}
                        />
                    </div>
                ) : (
                    <Button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="fixed right-6 bottom-6 h-14 w-14 rounded-full bg-[#E6E4E1] shadow-lg transition-shadow hover:shadow-xl"
                    >
                        <Sparkles strokeWidth={2.25} color="#3D3C3A" />
                    </Button>
                )}
            </div>
        </div>
    );
}
