import type { Problem } from '@/entities/models/problem';
import { useEffect, useState } from 'react';
import { getProblem } from '@/actions';

/**
 * useFetchProblem hook
 *
 * Custom React hook to fetch a math problem by its ID and manage
 * loading and error states.
 *
 * @param problemId - The unique identifier of the problem to fetch.
 *
 * @returns An object containing:
 *   - `problem`: The fetched Problem object (or undefined if not yet loaded)
 *   - `loadingProblem`: Boolean indicating if the problem is currently being loaded
 *   - `errorProblem`: String with an error message if fetching failed, otherwise null
 *
 * Example usage:
 * ```ts
 * const { problem, loadingProblem, errorProblem } = useFetchProblem(123);
 * if (loadingProblem) return <p>Loading...</p>;
 * if (errorProblem) return <p>Error: {errorProblem}</p>;
 * return <ProblemCard problem={problem} />;
 * ```
 */
export function useFetchProblem(problemId: number) {
    const [problem, setProblem] = useState<Problem>();
    const [loadingProblem, setLoadingProblem] = useState(true);
    const [errorProblem, setErrorProblem] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProblem() {
            try {
                setLoadingProblem(true);
                setErrorProblem(null);
                const fetchedProblem = await getProblem(problemId);
                setProblem(fetchedProblem);
            } catch (err) {
                console.error('Error fetching problem:', err);
                setErrorProblem(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch problem',
                );
            } finally {
                setLoadingProblem(false);
            }
        }

        fetchProblem();
    }, [problemId]);

    return { problem, loadingProblem, errorProblem };
}
