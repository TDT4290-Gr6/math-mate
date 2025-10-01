import { problemSchema } from './problem';
import { userSchema } from './user';
import { z } from 'zod';

export const solvesSchema = z.object({
    id: z.int(),
    userId: userSchema.shape.id,
    problemId: problemSchema.shape.id,
    // missmatch to supabase -> in supabase optional
    // are they really optional? i mean it needs to be if you want to create a solves entry before finishing it
    attemps: z.int().min(1),
    startedSolvingAt: z.date(),
    finishedSolvingAt: z.date(),
    stepsUsed: z.int().min(0),
    feedback: z.int().min(1).max(5),
});

export type Solves = z.infer<typeof solvesSchema>;

export const insertSolvesSchema = solvesSchema.pick({
    userId: true,
    problemId: true,
    attemps: true,
    startedSolvingAt: true,
    finishedSolvingAt: true,
    stepsUsed: true,
    feedback: true,
});

export type SolvesInsert = z.infer<typeof insertSolvesSchema>;
