import { LaTeXFormattedText } from './latex-formatted-text';
import { Button } from '@/components/ui/button';
import { Card } from './card';
import Title from './title';

/**
 * Props for the `MethodCard` component.
 */
interface MethodCardProps {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick?: () => void;
    disableButton?: boolean;
    methodNumber?: number;
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
    disableButton,
    methodNumber,
}: MethodCardProps) {
    return (
        <Card className="relative m-3 w-full gap-2 px-6 pt-4">
            {/* Method number */}
            <Title
                title={
                    methodNumber !== undefined
                        ? `Method ${methodNumber}:`
                        : 'Chosen method:'
                }
                size={20}
            />
            {/* Title */}
            <p className="border-border mt-[-26px] line-clamp-7 border-b pt-4 pb-2 text-sm font-semibold">
                {title}
            </p>

            {/* Description */}
            <div className="mt-2 mb-8">
                <LaTeXFormattedText text={description} />
            </div>

            {/* Button */}
            {!disableButton && (
                <div className="absolute right-8 -bottom-5">
                    <Button
                        className="bg-[var(--accent)] px-6 py-2"
                        onClick={onButtonClick}
                    >
                        {buttonText}
                    </Button>
                </div>
            )}
        </Card>
    );
}
