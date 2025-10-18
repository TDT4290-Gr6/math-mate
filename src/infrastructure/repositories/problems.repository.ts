import type { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import { DatabaseOperationError } from '@/entities/errors/common';
import type { Problem } from '@/entities/models/problem';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class ProblemsRepository implements IProblemsRepository {
    async getProblems(
        offset: number,
        limit: number,
        id: number,
        score: number,
        subjects?: string[],
    ): Promise<Problem[]> {
        try {
            const solves = await prisma.solves.findMany({
                where: { userId: id },
                select: { problemId: true },
            });

            const solvedProblemIds = solves.map((solve) => solve.problemId);

            const whereClause: Prisma.ProblemWhereInput = {
                level: { gte: Math.floor(score) },
                ...(subjects?.length && { subject: { in: subjects } }),
            };

            if (solvedProblemIds.length > 0) {
                whereClause.id = { notIn: solvedProblemIds };
            }

            const prismaProblems = await prisma.problem.findMany({
                skip: offset,
                take: limit,
                where: whereClause,
                orderBy: { id: 'asc' },
                include: {
                    Method: {
                        orderBy: { id: 'asc' },
                        include: {
                            Step: { orderBy: { stepNumber: 'asc' } },
                        },
                    },
                },
            });

            const problems = prismaProblems.map((problem) => ({
                id: problem.id,
                title: problem.title ?? undefined,
                problem: problem.problem,
                solution: problem.solution,
                subject: problem.subject,
                level: problem.level,
                methods: problem.Method.map((method) => ({
                    id: method.id,
                    title: method.title,
                    description: method.description,
                    steps: method.Step.map((step) => ({
                        id: step.id,
                        stepNumber: step.stepNumber,
                        content: step.content,
                    })),
                })),
            }));

            return problems;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError('Failed to get problems', {
                    cause: error,
                });
            }
            throw error;
        }
    }

    async getProblemById(id: number): Promise<Problem> {
        try {
            const prismaProblem = await prisma.problem.findUniqueOrThrow({
                where: { id },
                include: {
                    Method: {
                        orderBy: { id: 'asc' },
                        include: {
                            Step: { orderBy: { stepNumber: 'asc' } },
                        },
                    },
                },
            });

            return {
                id: prismaProblem.id,
                title: prismaProblem.title ?? undefined,
                problem: prismaProblem.problem,
                solution: prismaProblem.solution,
                subject: prismaProblem.subject,
                level: prismaProblem.level,
                methods: prismaProblem.Method.map((method) => ({
                    id: method.id,
                    title: method.title,
                    description: method.description,
                    steps: method.Step.map((step) => ({
                        id: step.id,
                        stepNumber: step.stepNumber,
                        content: step.content,
                    })),
                })),
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError(
                    'Failed to fetch problem from the database.',
                    { cause: error },
                );
            }
            throw error;
        }
    }
}
