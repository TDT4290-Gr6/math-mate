'use client';

import { useTrackedLogger } from '@/components/logger/LoggerProvider';
import SubjectSelectPopup from '@/components/subject-select-popup';
import type { Problem } from '@/entities/models/problem';
import ProblemCard from '@/components/ui/problem-card';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProblems } from 'app/actions';

/**
 * ProblemPage component
 *
 * This page allows users to browse through a list of math problems,
 * navigate between them, select preferred subjects, and begin solving
 * problems using the method selection workflow.
 *
 * Features:
 * - Fetches problems in batches using `getProblems`, based on selected subjects.
 * - Displays the current problem with navigation buttons (next/previous).
 * - Opens a subject selection popup to filter problems by user-selected subjects.
 * - Provides a "Get started solving" button to move to the method page for the current problem.
 * - Handles infinite scrolling / lazy loading of problems and looping when reaching the end.
 * - Tracks user interactions such as next/previous problem navigation, subject popup usage,
 *   and starting to solve a problem using `useTrackedLogger`.
 *
 * State Management:
 * - `problems`: array of loaded problems
 * - `currentIndex`: index of the current problem
 * - `hasMore`: whether more problems are available for fetching
 * - `isLoading`: loading state for fetching problems
 * - `subjects`: selected subjects for filtering problems
 * - `error`: error message if problem fetching fails
 * - `hidePrevious`: flag to hide the previous button if on the first problem
 * - `isSubjectSelectOpen`: controls visibility of the subject selection popup
 *
 * Navigation:
 * - Selecting "Get started solving" navigates to `/protected/methods/{problemId}`.
 */
export default function ProblemPage() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hidePrevious, setHidePrevious] = useState(false);

    const tracked = useTrackedLogger();

    const [isSubjectSelectOpen, setIsSubjectSelectOpen] = useState(false);
    const openSubjectSelect = () => {
        setIsSubjectSelectOpen(true);
        void tracked.logEvent({
            actionName: 'open_subject_popup',
            problemId: currentProblem?.id,
            payload: {},
        });
    };
    const closeSubjectSelect = () => {
        setIsSubjectSelectOpen(false);
        void tracked.logEvent({
            actionName: 'close_subject_popup',
            problemId: currentProblem?.id,
            payload: {},
        });
    };

    const router = useRouter();
    const currentProblem = problems[currentIndex];
    const LIMIT = 10;

    /**
     * Initial effect that loads saved subject preferences from localStorage
     * and fetches the initial set of problems
     */
    useEffect(() => {
        const savedSubjects = localStorage.getItem('selectedSubjects');
        const parsedSubjects = savedSubjects ? JSON.parse(savedSubjects) : [];
        setSubjects(parsedSubjects);
        fetchProblems(parsedSubjects, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setHidePrevious(currentIndex === 0);
    }, [currentIndex]);

    const fetchProblems = async (
        subjects: string[],
        offset: number,
    ): Promise<number> => {
        if (isLoading || !hasMore) return 0;

        setError(null);
        setIsLoading(true);

        try {
            const newProblems = await getProblems(offset, LIMIT, subjects);

            if (newProblems.length < LIMIT) {
                setHasMore(false);
            }

            if (newProblems.length > 0) {
                setProblems((prev) => [...prev, ...newProblems]);
            }

            return newProblems.length;
        } catch {
            setError('Failed to get problems. Please try again later.');
            return 0;
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = async () => {
        const nextIndex = currentIndex + 1;

        // If we are trying to go beyond what we have loaded, fetch first
        if (nextIndex >= problems.length) {
            if (hasMore && !isLoading) {
                const fetched = await fetchProblems(subjects, problems.length);
                if (fetched > 0) {
                    setCurrentIndex(nextIndex);
                }
            }
            // If no more problems to fetch, loop back to start
            else if (!hasMore) {
                setCurrentIndex(0);
            }
        } else {
            // If we already have this problem loaded, just move to it
            setCurrentIndex(nextIndex);
        }
        const nextProblem = problems[nextIndex];
        void tracked.logEvent({
            actionName: 'next_problem',
            problemId: currentProblem?.id,
            payload: { next_problemId: nextProblem?.id },
        });
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const prevProblem = problems[prevIndex];

            setCurrentIndex(prevIndex);

            void tracked.logEvent({
                actionName: 'previous_problem',
                problemId: currentProblem?.id,
                payload: {
                    previous_problemId: prevProblem?.id,
                },
            });
        }
    };

    const handleStartSolving = () => {
        void tracked.logEvent({
            actionName: 'start_solving',
            problemId: currentProblem.id,
            payload: {},
        });
        router.push(`/protected/methods/${currentProblem.id}`);
    };

    const fetchNewProblems = async () => {
        setProblems([]);
        setCurrentIndex(0);
        setHasMore(true);

        const savedSubjects = localStorage.getItem('selectedSubjects');
        const newSubjects = savedSubjects ? JSON.parse(savedSubjects) : [];

        setSubjects(newSubjects);
        await fetchProblems(newSubjects, 0);
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-[var(--background)] text-[var(--foreground)]">
            <Header />
            <div className="mt-20">
                <ProblemCard
                    description={
                        currentProblem?.problem ??
                        (isLoading
                            ? 'Loading problem...'
                            : 'No problems available')
                    }
                    variant="withButtons"
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    onOpenSubjectSelect={openSubjectSelect}
                    hidePrevious={hidePrevious}
                />
            </div>
            <div className="mt-4 flex flex-col justify-center gap-12">
                {isSubjectSelectOpen && (
                    <SubjectSelectPopup
                        onClose={closeSubjectSelect}
                        onSave={(subjectsChanged) => {
                            if (subjectsChanged) {
                                fetchNewProblems();
                            }
                        }}
                    />
                )}
                <Button
                    variant="secondary"
                    className="m-14"
                    onClick={handleStartSolving}
                    disabled={!currentProblem}
                >
                    Get started solving
                </Button>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
}
