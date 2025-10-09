import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import Title from './title';

interface ProblemProps {
    description: string;
    variant?: 'basic' | 'withButtons';
    onNext?: () => void;
    onPrevious?: () => void;
}

/**
 * `ProblemCard` is a reusable component for displaying a math problem.
 *
 * It renders the problem description and optionally navigation buttons if `variant` is `'withButtons'`.
 *
 * @param description - The problem text to display.
 * @param variant - The display variant of the card (`'basic'` | `'withButtons'`). Default is `'basic'`.
 * @param onNext - Callback triggered when the "Another problem" button is clicked (optional).
 * @param onPrevious - Callback triggered when the "Previous problem" button is clicked (optional).
 */
export default function ProblemCard({
    description,
    variant = 'basic',
    onNext,
    onPrevious,
}: ProblemProps) {
    return (
        <Card className="max-w-[50vw] p-6">
            <Title title={'Problem: '} />
            <p className="mb-4 line-clamp-7 text-[var(--foreground)]">
                {description}
            </p>
            {variant === 'withButtons' && (
                <div className="flex justify-center gap-12">
                    <Button onClick={onPrevious} disabled={!onPrevious}>
                        <ChevronLeft className="h-4 w-4" />
                        Previous problem
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onNext}
                        disabled={!onNext}
                    >
                        Another problem
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </Card>
    );
}
