import { LaTeXFormattedText } from './latex-formatted-text';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import Title from './title';

interface ProblemProps {
    description: string | undefined;
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
            <LaTeXFormattedText text={description} />
            {variant === 'withButtons' && (
                <div className="flex justify-center gap-12">
                    <Button onClick={onPrevious} disabled={!onPrevious}>
                        <div className="flex flex-row items-center gap-2">
                            <ChevronLeft className="mt-1 h-4 w-4" />
                            Previous problem
                        </div>
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onNext}
                        disabled={!onNext}
                    >
                        <div className="flex flex-row items-center gap-2">
                            Another problem
                            <ChevronRight className="mt-1 h-4 w-4" />
                        </div>
                    </Button>
                </div>
            )}
        </Card>
    );
}
