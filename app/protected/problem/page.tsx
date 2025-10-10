'use client';

import SubjectSelectPopup from '@/components/subject-select-popup';
import ProblemCard from '@/components/ui/problem-card';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useEffect, useState } from 'react';
import { getProblems } from 'app/actions';
import Link from 'next/link';

export default function ProblemPage() {
    const [problems, setProblems] = useState<
        Awaited<ReturnType<typeof getProblems>>
    >([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [subjects, setSubjects] = useState([]);

    const [isSubjectSelectOpen, setIsSubjectSelectOpen] = useState(false);

    const openSubjectSelect = () => setIsSubjectSelectOpen(true);
    const closeSubjectSelect = () => setIsSubjectSelectOpen(false);
    const LIMIT = 5;

    // Initial fetch
    useEffect(() => {
        const savedSubjects = localStorage.getItem('selectedSubjects');
        const parsedSubjects = savedSubjects ? JSON.parse(savedSubjects) : [];
        setSubjects(parsedSubjects);
        fetchProblems(parsedSubjects);
    }, []);

    const fetchProblems = async (subjects: string[]) => {
        if (isLoading || !hasMore) return;

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

            setProblems((prev) => [...prev, ...newProblems]);
        } catch (error) {
            console.error('Failed to fetch problems:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = async () => {
        const nextIndex = currentIndex + 1;

        // If we are trying to go beyond what we have loaded, fetch first
        if (nextIndex >= problems.length) {
            if (hasMore && !isLoading) {
                await fetchProblems(subjects);
                setCurrentIndex(nextIndex);
            }
            // If no more problems to fetch, do nothing (can't go forward)
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

    const currentProblem = problems[currentIndex];

    const fetchNewProblems = () => {
        console.log('hei');

        // // Reset all state
        // setProblems([]);
        // setCurrentIndex(0);
        // setHasMore(true);

        // // Update subjects
        // const savedSubjects = localStorage.getItem('selectedSubjects');
        // const newSubjects = savedSubjects ? JSON.parse(savedSubjects) : [];
        // setSubjects(newSubjects);

        // // Fetch fresh problems with new subjects
        // setIsLoading(true);
        // try {
        //     const freshProblems = await getProblems(0, LIMIT, newSubjects);

        //     if (freshProblems.length < LIMIT) {
        //         setHasMore(false);
        //     }

        //     setProblems(freshProblems);
        // } catch (error) {
        //     console.error('Failed to fetch problems:', error);
        // } finally {
        //     setIsLoading(false);
        // }
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
                <Button variant="secondary">
                    <Link href="/protected/method">Get started solving</Link>
                </Button>
            </div>
        </div>
    );
}
