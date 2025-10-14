import type { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import {
    DatabaseOperationError,
    NotFoundError,
} from '@/entities/errors/common';
import type { Problem } from '@/entities/models/problem';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class ProblemsRepository implements IProblemsRepository {
    async getProblems(
        //TODO: filter out problems that the user already has solved
        offset: number,
        limit: number,
        subjects?: string[],
    ): Promise<Problem[]> {
        const prismaProblems = await prisma.problem.findMany({
            skip: offset,
            take: limit,
            where: subjects?.length ? { subject: { in: subjects } } : undefined,
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
                if (error.code === 'P2025') {
                    throw new NotFoundError(`Problem with id ${id} not found`);
                }

                throw new DatabaseOperationError(
                    'Failed to fetch problem from the database.',
                    { cause: error },
                );
            }
            throw error;
        }
    }
}
