import { problemSchema } from './problem';
import { userSchema } from './user';
import { z } from 'zod';

/**
 * Zod schema representing a user's solve of a problem.
 *
 * - `id`: Unique identifier of the solve.
 * - `userId`: ID of the user who solved the problem.
 * - `problemId`: ID of the problem that was solved.
 * - `attempts`: Number of attempts the user has made (minimum 1).
 * - `startedSolvingAt`: Timestamp when the user started solving.
 * - `stepsUsed`: Number of steps used to solve the problem (0 if solved independently).
 * - `finishedSolvingAt`: Optional timestamp when the user finished solving.
 * - `feedback`: Optional difficulty rating (1–5) provided by the user.
 * - `wasCorrect`: Optional boolean indicating if the solution was correct.
 * - `problemTitle`: Optional title of the problem.
 */
export const solveSchema = z.object({
    id: z.int(),
    userId: userSchema.shape.id,
    problemId: problemSchema.shape.id,
    attempts: z.int().min(1),
    startedSolvingAt: z.coerce.date(),
    stepsUsed: z.int().min(0),
    finishedSolvingAt: z.coerce.date().optional(),
    feedback: z.int().min(1).max(5).optional(),
    wasCorrect: z.boolean().optional(),
    problemTitle: problemSchema.shape.title.optional(),
});

/** Type representing a validated `Solve` object. */
export type Solve = z.infer<typeof solveSchema>;

/**
 * Zod schema for inserting a new solve record.
 *
 * Only includes the fields required for creating a solve:
 * - `userId`, `problemId`, `startedSolvingAt`, `finishedSolvingAt`, `stepsUsed`, `feedback`, `wasCorrect`
 */
export const insertSolveSchema = solveSchema.pick({
    userId: true,
    problemId: true,
    startedSolvingAt: true,
    finishedSolvingAt: true,
    stepsUsed: true,
    feedback: true,
    wasCorrect: true,
});

/** Type representing the data required to insert a new solve. */
export type SolveInsert = z.infer<typeof insertSolveSchema>;
