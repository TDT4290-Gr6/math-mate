'use client';

import { useFetchProblem } from 'app/hooks/useFetchProblem';
import ProblemCard from '@/components/ui/problem-card';
import { useParams, useRouter } from 'next/navigation';
import MethodCard from '@/components/ui/method-card';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';

/**
 * The page component that displays a set of method cards to help solve
 * a math problem. Users can also choose to solve the problem on their own.
 */
export default function MethodPage() {
    const params = useParams<{ problemId: string }>();
    const problemId = Number(params.problemId);
    const { problem, loadingProblem, errorProblem } =
        useFetchProblem(problemId);
    const router = useRouter();
    return (
        <div className="flex min-h-screen flex-col items-center gap-6">
            <Header
                variant="problem"
                mathProblem={
                    <div className="flex h-50 flex-row items-center justify-center gap-4">
                        <ProblemCard
                            description={
                                loadingProblem
                                    ? 'Loading problem...'
                                    : errorProblem
                                      ? 'Error loading problem'
                                      : (problem?.problem ??
                                        'No problem available')
                            }
                        />
                    </div>
                }
            />

            <div className="px-[15%]">
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
                } min-h-[300px] px-10`}
            >
                {problem?.methods?.map((method, index) => (
                    <MethodCard
                        key={method.id}
                        title={method.title}
                        description={method.description}
                        buttonText="Get Started"
                        onButtonClick={() =>
                            router.push(
                                `/protected/solve/${problemId}/${method.id}`,
                            )
                        }
                        methodNumber={index + 1}
                    />
                ))}
            </div>
            <div className="flex flex-col items-center">
                <p className="pb-4">or</p>
                <Button
                    className="mb-20 w-48 bg-[var(--accent)]"
                    onClick={() =>
                        router.push(`/protected/solve-yourself/${problemId}`)
                    }
                    disabled={!Number.isFinite(problemId)}
                >
                    Solve on your own
                </Button>
            </div>
        </div>
    );
}
