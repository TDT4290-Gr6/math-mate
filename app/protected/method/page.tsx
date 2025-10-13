'use client';

import { useProblemStore } from 'app/store/problem-store';
import ProblemCard from '@/components/ui/problem-card';
import MethodCard from '@/components/ui/methodcard';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useRouter } from 'next/navigation';

/**
 * The page component that displays a set of method cards to help solve
 * a math problem. Users can also choose to solve the problem on their own.
 */
export default function MethodPage() {
    const problem = useProblemStore((state) => state.problem);
    const router = useRouter();
    return (
        <div className="flex min-h-screen flex-col items-center gap-6">
            <Header
                variant="problem"
                mathProblem={
                    <div className="flex h-50 flex-row items-center justify-center gap-4">
                        <ProblemCard description={problem?.problem} />
                    </div>
                }
            />

            <div className="px-[15%] pt-4">
                <p>
                    To help you with the math problem you will be provided a set
                    of methods you can use to solve the problem. You don&#39;t
                    have to use any of these provided methods, but they are
                    meant to provide guidance in solving the problem. It&#39;s
                    up to you which method to use.
                </p>
            </div>
            <div
                className={`flex w-full flex-col lg:flex-row ${
                    problem?.methods?.length === 3 ? 'max-w-6xl' : 'max-w-5xl'
                } px-10`}
            >
                {problem?.methods?.map((method) => (
                    <MethodCard
                        key={method.id}
                        title={method.title}
                        description={method.description}
                        buttonText="Get Started"
                        onButtonClick={() => router.push('/protected/solve')}
                    />
                ))}
            </div>
            <div className="flex flex-col items-center">
                <p className="pb-4">or</p>
                {/* TODO: change link to "solve on your own" page */}
                <Button
                    className="mb-20 w-48 bg-[var(--accent)]"
                    onClick={() => router.push('/protected/solve-yourself')}
                >
                    Solve on your own
                </Button>
            </div>
        </div>
    );
}
