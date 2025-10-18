import { LaTeXFormattedText } from './latex-formatted-text';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from './skeleton';
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
    const isLoading = description === 'Loading problem...';

    return (
        <Card
            className={`relative w-[50vw] p-6 ${variant === 'withButtons' && 'min-h-56 pb-10'} mb-6 px-16`}
        >
            <div className="flex flex-row items-center">
                <Title title={'Problem: '} />
            </div>
            {isLoading ? (
                <div className="-mt-4 w-full">
                    <Skeleton className="w-full" />
                </div>
            ) : (
                <div className="justify-left -mt-4 mb-6 flex w-full items-center">
                    <LaTeXFormattedText
                        text={description ?? 'No problem available'}
                    />
                </div>
            )}

            {variant === 'withButtons' && (
                <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 -translate-y-1/2 justify-center gap-12">
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
