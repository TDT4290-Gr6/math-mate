import type { Problem } from '@/entities/models/problem';
import { useEffect, useState } from 'react';
import { getProblem } from '@/actions';

export function useFetchProblem(problemId: number) {
    const [problem, setProblem] = useState<Problem>();
    const [loadingProblem, setLoadingProblem] = useState(false);
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
