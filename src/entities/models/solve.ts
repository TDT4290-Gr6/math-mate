import { problemSchema } from './problem';
import { userSchema } from './user';
import { z } from 'zod';

export const solveSchema = z.object({
    id: z.int(),
    userId: userSchema.shape.id,
    problemId: problemSchema.shape.id,
    attempts: z.int().min(1),
    startedSolvingAt: z.date(),
    stepsUsed: z.int().min(0),
    finishedSolvingAt: z.date().optional(),
    feedback: z.int().min(1).max(5).optional(),
});

export type Solve = z.infer<typeof solveSchema>;

export const insertSolveSchema = solveSchema.pick({
    userId: true,
    problemId: true,
    attempts: true,
    startedSolvingAt: true,
    finishedSolvingAt: true,
    stepsUsed: true,
    feedback: true,
});

export type SolveInsert = z.infer<typeof insertSolveSchema>;
