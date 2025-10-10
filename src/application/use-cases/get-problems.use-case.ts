import { IProblemsRepository } from '../repositories/problems.repository.interface';
import { Problem } from '@/entities/models/problem';

export type IGetProblemsUseCase = ReturnType<typeof getProblemsUseCase>;

export const getProblemsUseCase =
    (problemRepository: IProblemsRepository) =>
    async (
        offset: number,
        limit: number,
        subjects?: string[],
    ): Promise<Problem[]> => {
        return await problemRepository.getProblems(offset, limit, subjects);
    };
