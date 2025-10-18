import type { IProblemsRepository } from '../repositories/problems.repository.interface';
import type { Problem } from '@/entities/models/problem';

export type IGetProblemsUseCase = ReturnType<typeof getProblemsUseCase>;

export const getProblemsUseCase =
    (problemRepository: IProblemsRepository) =>
    async (
        offset: number,
        limit: number,
        userId: number,
        userScore: number,
        subjects?: string[],
    ): Promise<Problem[]> => {
        return await problemRepository.getProblems(
            offset,
            limit,
            userId,
            userScore,
            subjects,
        );
    };
