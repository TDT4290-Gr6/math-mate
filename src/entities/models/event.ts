import { problemSchema } from './problem';
import { methodSchema } from './method';
import { userSchema } from './user';
import { stepSchema } from './step';
import { z } from 'zod';

export const eventSchema = z.object({
    id: z.int(),
    userId: userSchema.shape.id,
    sessionId: z.number().int(),
    actionName: z.string().min(1).max(100),
    loggedAt: z.date(),
    problemId: problemSchema.shape.id.optional(),
    methodId: methodSchema.shape.id.optional(),
    stepId: stepSchema.shape.id.optional(),
    payload: z.string(),
});

export type Event = z.infer<typeof eventSchema>;

export const insertEventSchema = eventSchema.pick({
    userId: true,
    sessionId: true,
    actionName: true,
    loggedAt: true,
    problemId: true,
    methodId: true,
    stepId: true,
    payload: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
