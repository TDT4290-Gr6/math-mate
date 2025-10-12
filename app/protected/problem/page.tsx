'use client';

import SubjectSelectPopup from '@/components/subject-select-popup';
import { useProblemStore } from 'app/store/problem-store';
import ProblemCard from '@/components/ui/problem-card';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProblems } from 'app/actions';
import { Problem } from 'app/types';

/**
 * Problem browsing page component that allows users to navigate through problems,
 * select subjects, and begin solving problems.
 */
export default function ProblemPage() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [isSubjectSelectOpen, setIsSubjectSelectOpen] = useState(false);
    const openSubjectSelect = () => setIsSubjectSelectOpen(true);
    const closeSubjectSelect = () => setIsSubjectSelectOpen(false);

    const setCurrentProblem = useProblemStore((state) => state.setProblem);
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
        fetchProblems(parsedSubjects);
    }, []);

    const fetchProblems = async (subjects: string[]): Promise<number> => {
        if (isLoading || !hasMore) return 0;

        setIsLoading(true);
        try {
            const newProblems = await getProblems(
                problems.length,
                LIMIT,
                subjects,
            );

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
                const fetched = await fetchProblems(subjects);
                if (fetched > 0) {
                    setCurrentIndex(nextIndex);
                }
            }
            // If no more problems to fetch, do nothing (can't go forward), or render a message(TODO)
        } else {
            // If we already have this problem loaded, just move to it
            setCurrentIndex(nextIndex);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const fetchNewProblems = () => {
        console.log('TODO');
    };

    const goToMethodPage = () => {
        if (!currentProblem) return;
        setCurrentProblem(currentProblem); // Zustand
        router.push('/protected/method');
    };
    return (
        <div className="flex min-h-screen flex-col items-center bg-[var(--background)] text-[var(--foreground)]">
            <Header />
            <div className="mt-20">
                <ProblemCard
                    description={
                        currentProblem?.problem ??
                        (isLoading
                            ? 'Loading problems...'
                            : 'No problems available')
                    }
                    variant="withButtons"
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                />
            </div>
            <div className="mt-10 flex flex-col justify-center gap-8">
                <button
                    className="text-opacity-20 cursor-pointer text-sm underline underline-offset-4 opacity-70 hover:opacity-90"
                    onClick={openSubjectSelect}
                >
                    Change subjects?
                </button>
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
                    onClick={goToMethodPage}
                    disabled={!currentProblem}
                >
                    Get started solving
                </Button>
                {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
        </div>
    );
}
