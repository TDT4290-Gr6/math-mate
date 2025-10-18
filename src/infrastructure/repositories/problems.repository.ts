import type { IProblemsRepository } from '@/application/repositories/problems.repository.interface';
import { DatabaseOperationError } from '@/entities/errors/common';
import type { Problem } from '@/entities/models/problem';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Repository class for managing problem entities in the database.
 *
 * Provides methods to retrieve problems and individual problem details using Prisma ORM.
 *
 * Implements the `IProblemsRepository` interface.
 */
export class ProblemsRepository implements IProblemsRepository {
    /**
     * Retrieves a paginated list of problems from the database.
     *
     * This method filters problems based on:
     * - The user's ID, excluding problems the user has already solved.
     * - The user's score, returning problems with a level greater than or equal to the score.
     * - Optional subject filters, if provided.
     *
     * Each problem includes its associated methods and ordered steps.
     *
     * @param offset - The number of problems to skip (used for pagination).
     * @param limit - The number of problems to return (used for pagination).
     * @param id - The ID of the user requesting problems.
     * @param score - The user's current score, used to determine difficulty level filtering.
     * @param subjects - Optional list of subjects to filter problems by.
     *
     * @returns A promise that resolves to an array of `Problem` objects matching the criteria.
     *
     * @throws {DatabaseOperationError} If a known Prisma client error occurs during the query.
     * @throws {Error} If an unknown error occurs during the database operation.
     */
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
    /**
     * Retrieves a single problem by its unique ID.
     *
     * This method fetches the problem along with its related methods and ordered steps.
     *
     * @param id - The unique identifier of the problem to retrieve.
     *
     * @returns A promise that resolves to the `Problem` object with its methods and steps.
     *
     * @throws {DatabaseOperationError} If a known Prisma client error occurs during the query.
     * @throws {Error} If an unknown error occurs during the database operation.
     */
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
