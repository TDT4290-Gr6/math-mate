import { Button } from '@/components/ui/button';
import Title from './title';
import React from 'react';

interface MethodCardProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick?: () => void;
}

export default function MethodCard({
    title,
    description,
    buttonText,
    onButtonClick,
}: MethodCardProps) {
    return (
        <div className="w-min-128 h-min-64 relative mx-4 my-4 flex flex-col items-start justify-start rounded-xl bg-[var(--background)] p-4 text-start shadow-sm">
            {/* Title */}
            <Title title={title} />

            {/* Description */}
            <p className="mb-4 line-clamp-7 text-[var(--foreground)]">{description}</p>

            {/* Button */}
            <div className="absolute right-8 -bottom-5">
                <Button className="px-6 py-2" onClick={onButtonClick}>
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
