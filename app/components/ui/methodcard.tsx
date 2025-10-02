import { Button } from '@/components/ui/button';
import React from 'react';
import Title from './title';

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
        <div className="w-min-128 relative mx-4 my-4 flex h-min-64 flex-col items-start justify-start rounded-xl bg-[var(--background)] p-4 text-start shadow-sm">
            {/* Title */}
            <Title title={title} />

            {/* Description */}
            <p className="mb-4 text-gray-600 line-clamp-7">{description}</p>

            {/* Button */}
            <div className="absolute -bottom-5 right-8">
                <Button className="px-6 py-2" onClick={onButtonClick}>
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
