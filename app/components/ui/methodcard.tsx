import { Button } from '@/components/ui/button';
import Title from './title';
import React from 'react';

/**
 * Props for the `MethodCard` component.
 */
interface MethodCardProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick?: () => void;
}

/**
 * A card component representing a method, with a title, description, and button.
 *
 * The button is positioned visually halfway outside the card for emphasis.
 *
 * @param {MethodCardProps} props - Props for the MethodCard component.
 * @param {string} props.title - Title text for the card.
 * @param {string} props.description - Description text for the card.
 * @param {string} props.buttonText - Text for the button.
 * @param {() => void} [props.onButtonClick] - Optional callback when the button is clicked.
 * @returns {JSX.Element} A styled card component with an overlapping button.
 */
export default function MethodCard({
    title,
    description,
    buttonText,
    onButtonClick,
}: MethodCardProps) {
    return (
        <div className="min-w-[128px] min-h-[64px] relative mx-4 my-4 flex flex-col items-start justify-start rounded-xl bg-[var(--background)] p-4 text-start shadow-sm">
            {/* Title */}
            <Title title={title} />

            {/* Description */}
            <p className="mb-4 line-clamp-7 text-[var(--foreground)]">
                {description}
            </p>

            {/* Button */}
            <div className="absolute right-8 -bottom-5">
                <Button className="px-6 py-2" onClick={onButtonClick}>
                    {buttonText}
                </Button>
            </div>
        </div>
    );
}
