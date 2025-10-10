'use server';

import { getInjection } from '@/di/container';

export async function getProblems(
    offset: number,
    limit: number,
    subjects: string[],
) {
    const getProblemsController = getInjection('IGetProblemsController');
    const problems = getProblemsController({ offset, limit, subjects });
    return problems;
}
