import { ISolvesRepository } from '@/application/repositories/solves.repository.interface';
import { insertSolveSchema, Solve, SolveInsert } from '@/entities/models/solve';
import { DatabaseOperationError } from '@/entities/errors/common';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export class SolvesRepository implements ISolvesRepository {
    async getById(id: number): Promise<Solve | null> {
        try {
            const solve = await prisma.solves.findUnique({
                where: { id: id },
            });
            return solve as Solve | null;
        } catch (error) {
            throw new DatabaseOperationError('Failed to get solve by ID', {
                cause: error,
            });
        }
    }
    async getByUserId(userId: number): Promise<Solve[]> {
        try {
            const solves = await prisma.solves.findMany({
                where: { userId: userId },
            });
            return solves as Solve[];
        } catch (error) {
            throw new DatabaseOperationError(
                'Failed to get solves by user ID',
                {
                    cause: error,
                },
            );
        }
    }
    async getLatestByUserId(userId: number): Promise<Solve[]> {
        try {
            const solves = await prisma.solves.findMany({
                // Only retrieve solves that have been finished
                where: { userId: userId, finishedSolvingAt: { not: null } },
                // Latest finished problems first
                orderBy: { finishedSolvingAt: 'desc' },
                // Distinct by problemId to get only one solve per problem
                distinct: ['problemId'],
                // Include the title of the problem
                include: { problem: { select: { title: true } } },
            });
            const solvesWithTitle = solves.map((solve) => {
                return {
                    ...solve,
                    problemTitle: solve.problem?.title,
                } as Solve;
            });

            return solvesWithTitle;
        } catch (error) {
            throw new DatabaseOperationError(
                'Failed to get latest solves by user ID',
                {
                    cause: error,
                },
            );
        }
    }

    async getByProblemId(problemId: number): Promise<Solve[]> {
        try {
            const solves = await prisma.solves.findMany({
                where: { problemId: problemId },
            });
            return solves as Solve[];
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError(
                    'Failed to get solves by problem ID',
                    {
                        cause: error,
                    },
                );
            }
            throw error;
        }
    }
    async getAttemptCount(userId: number, problemId: number): Promise<number> {
        try {
            const count = await prisma.solves.count({
                where: {
                    userId: userId,
                    problemId: problemId,
                },
            });
            return count;
        } catch (error) {
            throw new DatabaseOperationError('Failed to get attempt count', {
                cause: error,
            });
        }
    }
    async createSolve(solve: SolveInsert): Promise<Solve> {
        try {
            const attemptsUsed = await this.getAttemptCount(
                solve.userId,
                solve.problemId,
            );
            const parsedSolve = insertSolveSchema.parse(solve);

            const newSolve = await prisma.solves.create({
                data: { ...parsedSolve, attempts: attemptsUsed + 1 },
            });

            // Recalculate user score after creating a new solve
            await this.updateUserScore(solve.userId);

            return newSolve as Solve;
        } catch (error) {
            throw new DatabaseOperationError('Failed to create solve', {
                cause: error,
            });
        }
    }
    async updateSolve(id: number, solve: Partial<SolveInsert>): Promise<Solve> {
        try {
            const updatedSolve = await prisma.solves.update({
                where: { id: id },
                data: solve,
            });
            return updatedSolve as Solve;
        } catch (error) {
            throw new DatabaseOperationError('Failed to update solve', {
                cause: error,
            });
        }
    }
    async deleteSolve(id: number): Promise<Solve> {
        try {
            const deletedSolve = await prisma.solves.delete({
                where: { id: id },
            });
            return deletedSolve as Solve;
        } catch (error) {
            throw new DatabaseOperationError('Failed to delete solve', {
                cause: error,
            });
        }
    }

    private async updateUserScore(userId: number): Promise<void> {
        const score = await this.calculateScore(userId);
        await prisma.user.update({
            where: { id: userId },
            data: { score: score },
        });
    }

    /**
     * Calculates the user's score as the average level of distinct problems the user solved correctly.
     *
     * The method:
     * - Fetches distinct solved problems for the given user where the solve was marked correct.
     * - Uses the associated problem's `level` value to compute an arithmetic mean.
     * - Treats a missing (`null`/`undefined`) problem level as `0`.
     * - Returns `0` when the user has no correct solves.
     *
     * Notes:
     * - Duplicate solves for the same problem are ignored (distinct by `problemId`).
     * - The result is a plain numeric average (no rounding performed).
     *
     * @param userId - The database identifier of the user whose score will be computed.
     * @returns A promise that resolves to the average problem level (number). Returns `0` if there are no correct distinct solves.
     * @throws DatabaseOperationError - If the underlying database operation fails; the original error is attached as the `cause`.
     */
    private async calculateScore(userId: number): Promise<number> {
        try {
            const solvesWithProblem = await prisma.solves.findMany({
                where: { userId, wasCorrect: true },
                distinct: ['problemId'],
                include: { problem: { select: { level: true } } },
            });

            if (solvesWithProblem.length === 0) return 0;

            const avgLevel =
                solvesWithProblem.reduce(
                    (sum, s) => sum + (s.problem?.level ?? 0),
                    0,
                ) / solvesWithProblem.length;

            return avgLevel;
        } catch (error) {
            throw new DatabaseOperationError('Failed to calculate user score', {
                cause: error,
            });
        }
    }
}
