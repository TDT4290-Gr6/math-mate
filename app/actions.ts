'use server';

import { getInjection } from '@/di/container';
import { Problem } from './types';

export async function getProblems(
    offset: number,
    limit: number,
    subjects: string[],
): Promise<Problem[]> {
    const getProblemsController = getInjection('IGetProblemsController');
    const problems = getProblemsController({ offset, limit, subjects });
    return problems;
}
