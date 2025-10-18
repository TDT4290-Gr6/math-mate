import { LaTeXFormattedText } from './latex-formatted-text';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Card } from './card';
import Title from './title';
import { motion } from 'framer-motion';

interface ProblemProps {
    description: string | undefined;
    variant?: 'basic' | 'withButtons';
    onNext?: () => void;
    onPrevious?: () => void;
    onOpenSubjectSelect?: () => void;
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
    onOpenSubjectSelect: openSubjectSelect,
}: ProblemProps) {

    const isLoading = (description === 'Loading problem...');
    
    return (
        <Card className={`w-[50vw] p-6 relative ${variant === 'withButtons' && 'pb-10 min-h-56'} mb-6 px-16`}>
            <div className="flex flex-row items-top justify-between">
            <Title title={'Problem: '} />
            {variant === 'withButtons' && (   
                <Button
                    variant={"link"}
                    className='-mt-10 -mr-14'
                    onClick={openSubjectSelect}
                >
                    Change subjects?
                </Button>
            )}
            </div>
            {isLoading ? (
                <div className="w-full h-12">

                </div>
            ) : (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="items-center flex justify-left -mt-4 mb-6 w-full"
                >
                <LaTeXFormattedText text={description ?? 'No problem available'} />
            </motion.div>
            )}

            {variant === 'withButtons' && (
                <div className="absolute left-1/2 -bottom-10 flex -translate-x-1/2 -translate-y-1/2 justify-center gap-20">
                    <Button 
                        onClick={onPrevious} 
                        disabled={!onPrevious} 
                        size="lg">
                        <div className="flex flex-row items-center gap-2">
                            <ChevronLeft className="mt-1 h-4 w-4" />
                            Previous problem
                        </div>
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={onNext}
                        disabled={!onNext}
                        size="lg"
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
