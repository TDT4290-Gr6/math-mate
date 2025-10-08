'use client';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import React from 'react';

export default function ChatToggle() {
    const [open, setOpen] = React.useState(true);

    React.useEffect(() => {
        const t = setTimeout(() => setOpen(false), 4000); // auto-close help tooltip
        return () => clearTimeout(t);
    }, []);

    const handleClick = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('chat-toggle'));
        }
    };

    return (
        <TooltipProvider>
            <Tooltip open={open} onOpenChange={setOpen}>
                <TooltipTrigger asChild className="bg-[var(--chatbot)]">
                    <Button
                        onClick={handleClick}
                        className="hover:bg-card fixed right-6 bottom-6 h-12 w-12 rounded-full bg-[var(--chatbot)] shadow-lg transition-shadow hover:shadow-xl"
                    >
                        <Sparkles className="text-[var(--foreground)]" />
                    </Button>
                </TooltipTrigger>

                <TooltipContent
                    side="top"
                    sideOffset={10}
                    arrowColor="var(--chatbot)"
                    className="relative w-58 rounded-xl bg-[var(--chatbot)] p-3 text-[var(--foreground)] shadow-lg"
                >
                    <div className="text-sm">
                        <h3 className="mb-1 font-bold">
                            Need help with the math problem?
                        </h3>
                        <p>
                            Press me to open a chat to ask questions about the
                            math problem or one of the steps.
                        </p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
// ...existing code...
