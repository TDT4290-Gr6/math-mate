import { Button } from '@/components/ui/button';
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
        <div className="w-min-128 relative flex h-64 flex-col items-start justify-start rounded-xl bg-[var(--background)] p-4 text-start shadow-md">
            {/* Title */}
            <h2 className="mb-2 text-xl font-semibold">{title}</h2>

            {/* Description */}
            <p className="mb-4 text-gray-600">{description}</p>

            {/* Button */}
            <div className="absolute -bottom-6">
                <Button className="px-6 py-2" onClick={onButtonClick}>
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
