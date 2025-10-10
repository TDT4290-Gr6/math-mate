import { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import { Problem } from '@/entities/models/problem';
import { prisma } from '@/lib/prisma';

export class ProblemsRepository implements IProblemsRepository {
    async getProblems(
        offset: number,
        limit: number,
        subjects?: string[],
    ): Promise<Problem[]> {
        const problems = await prisma.problem.findMany({
            skip: offset,
            take: limit,
            where:
                subjects && subjects.length > 0
                    ? {
                          subject: {
                              in: subjects,
                          },
                      }
                    : undefined,
            orderBy: {
                id: 'asc',
            },
        });
        return problems;
    }
}
