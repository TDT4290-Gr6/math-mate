import { IProblemsRepository } from '../repositories/problems.repository.interface';
import { Problem } from '@/entities/models/problem';

export type IGetProblemUseCase = ReturnType<typeof getProblemUseCase>;

export const getProblemUseCase =
    (problemRepository: IProblemsRepository) =>
    async (problemId: number): Promise<Problem> => {
        return await problemRepository.getProblemById(problemId);
    };
