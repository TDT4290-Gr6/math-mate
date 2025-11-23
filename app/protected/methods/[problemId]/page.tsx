'use client';

import { useTrackedLogger } from '@/components/logger/LoggerProvider';
import { useFetchProblem } from 'app/hooks/useFetchProblem';
import { useParams, useRouter } from 'next/navigation';
import ProblemCard from '@/components/problem-card';
import MethodCard from '@/components/method-card';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';

/**
 * MethodPage component
 *
 * This page displays a math problem along with a set of method cards
 * that provide guidance on how to solve it. Users can choose one of
 * the suggested methods or opt to solve the problem on their own.
 *
 * Features:
 * - Fetches the problem data using `useFetchProblem` based on the
 *   `problemId` from the URL parameters.
 * - Displays a `ProblemCard` showing the problem description.
 * - Renders a set of `MethodCard` components for each available method.
 * - Provides a button for users to skip methods and solve the problem themselves.
 * - Tracks user interactions with methods and the "solve yourself" action
 *   using `useTrackedLogger`.
 *
 * Navigation:
 * - Choosing a method navigates to `/protected/solve/{problemId}/{methodId}`.
 * - Solving on your own navigates to `/protected/solve-yourself/{problemId}`.
 *
 * Accessibility:
 * - Provides notes and labels for screen readers for hints and problem context.
 */
export default function MethodPage() {
    const params = useParams<{ problemId: string }>();
    const problemId = Number(params.problemId);
    const { problem, loadingProblem, errorProblem } =
        useFetchProblem(problemId);
    const router = useRouter();
    const tracked = useTrackedLogger();

    const handleSolve = () => {
        void tracked.logEvent({
            actionName: 'solve_yourself',
            problemId: problemId,
            payload: {},
        });
        router.push(`/protected/solve-yourself/${problemId}`);
    };

    const handleChooseMethod = (methodId: number) => {
        void tracked.logEvent({
            actionName: 'choose_method',
            problemId: problemId,
            methodId: methodId,
            payload: {},
        });
        router.push(`/protected/solve/${problemId}/${methodId}`);
    };

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
                <aside role="note" aria-label="Hint about methods">
                    <p>
                        To help you with the math problem you will be provided a
                        set of methods you can use to solve the problem. You
                        don&#39;t have to use any of these provided methods, but
                        they are meant to provide guidance in solving the
                        problem. It&#39;s up to you which method to use.
                    </p>
                </aside>
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
                        onButtonClick={() => handleChooseMethod(method.id)}
                        methodNumber={index + 1}
                    />
                ))}
            </div>
            <div className="flex flex-col items-center">
                <p className="pb-4">or</p>
                <Button
                    className="mb-20 w-48 bg-[var(--accent)]"
                    onClick={handleSolve}
                    disabled={!Number.isFinite(problemId)}
                >
                    Solve on your own
                </Button>
            </div>
        </div>
    );
}
