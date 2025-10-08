'use client';

import ProblemCard from '@/components/ui/problem-card';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useState } from 'react';
import Link from 'next/link';

/**
 * TODO: update docs when api is ready
 *
 * A page component that displays problems and navigation controls.
 *
 * @component
 * @returns {JSX.Element} The rendered ProblemPage component.
 */
export default function ProblemPage() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // TODO: Fetcing questions
    // GET /api/questions?subjects=algebra,geometry&offset=0&limit=5
    //   useEffect(() => {
    //   fetchQuestions(offset);
    // }, []);

    // const handleNext = () => {
    //   const nextIndex = currentIndex + 1;
    //   if (nextIndex >= questions.length && hasMore) {
    //     // No more local questions — fetch more
    //     const newOffset = offset + 5;
    //     setOffset(newOffset);
    //     fetchQuestions(newOffset);
    //   }
    //   setCurrentIndex(nextIndex);
    // };

    // const handlePrevious = () => {
    //   if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    // };
    //const currentQuestion = questions[currentIndex];

    //Just for mocking, will be removed when api are made
    const [description, setDescription] = useState(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nunc diam. Fusce accumsan tempor justo ac pellentesque. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. .',
    );

    return (
        <div className="flex min-h-screen flex-col items-center bg-[var(--background)] text-[var(--foreground)]">
            <Header />
            <div className="mt-20">
                <ProblemCard description={description} variant="withButtons" />
            </div>
            <div className="mt-10 flex flex-col justify-center gap-8">
                <button className="text-opacity-20 cursor-pointer text-sm underline underline-offset-4 opacity-70 hover:opacity-90">
                    Change subjects?
                </button>
                <Button variant="secondary">
                    <Link href="/protected/method">Get started solving</Link>
                </Button>
            </div>
        </div>
    );
}
