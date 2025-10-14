import { Problem } from '@/entities/models/problem';
import { useEffect, useState } from 'react';
import { getProblem } from '@/actions';

export function useFetchProblem(problemId: number) {
    const [problem, setProblem] = useState<Problem>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProblem() {
            try {
                setLoading(true);
                setError(null);
                const fetchedProblem = await getProblem(problemId);
                setProblem(fetchedProblem);
            } catch (err) {
                console.error('Error fetching problem:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch problem',
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProblem();
    }, [problemId]);

    return { problem, loading, error };
}
