'use client';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from '@/components/ui/button';
import { BsStars } from 'react-icons/bs';
import React from 'react';

interface ChatToggleProps {
    onClick?: () => void;
}

export default function ChatToggle({ onClick }: ChatToggleProps) {
    const [openTooltip, setOpenTooltip] = React.useState(true);

    // Hide tooltip after 6 seconds
    React.useEffect(() => {
        let t: NodeJS.Timeout | undefined;
        if (openTooltip) {
            t = setTimeout(() => setOpenTooltip(false), 6000);
        }
        return () => {
            if (t) clearTimeout(t);
        };
    }, []); // the dependency is empty because we only want it to run once per mount

    return (
        <Tooltip open={openTooltip} defaultOpen={true} onOpenChange={setOpenTooltip}>
            <TooltipTrigger asChild>
                <Button
                    aria-label="Open chat"
                    onClick={onClick}
                    className="hover:bg-card fixed right-34 bottom-20 h-18 w-18 rounded-full bg-[var(--chatbot)] shadow-lg transition-shadow hover:shadow-xl"
                >
                    <BsStars className="size-10 text-[var(--foreground)]" />
                </Button>
            </TooltipTrigger>

            <TooltipContent
                side="top"
                sideOffset={10}
                arrowColor="var(--chatbot)"
                className="relative w-72 rounded-xl bg-[var(--chatbot)] p-3 text-[var(--foreground)] shadow-lg"
            >
                <div className="text-sm">
                    <h3 className="mb-1 font-bold">
                        Need help with the math problem?
                    </h3>
                    <p>
                        Press me to open a chat to ask questions about the math
                        problem or one of the steps.
                    </p>
                </div>
            </TooltipContent>
        </Tooltip>
    );
}
