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
                where: { userId: userId, finishedSolvingAt: { not: null } },
                orderBy: { finishedSolvingAt: 'desc' },
            });
            return solves as Solve[];
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
    async createSolve(solve: SolveInsert): Promise<Solve> {
        try {
            // check if a solve with the same userId and problemId already exists
            const attemptsUsed = await prisma.solves.count({
                where: {
                    userId: solve.userId,
                    problemId: solve.problemId,
                },
            });
            const parsedSolve = insertSolveSchema.parse({
                ...solve,
                attempts: attemptsUsed + 1,
            });

            const newSolve = await prisma.solves.create({
                data: parsedSolve,
            });
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
}
