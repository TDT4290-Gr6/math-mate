import { problemSchema } from './problem';
import { methodSchema } from './method';
import { userSchema } from './user';
import { stepSchema } from './step';
import { z } from 'zod';

export const eventSchema = z.object({
    id: z.int(),
    userId: userSchema.shape.id,
    sessionId: z.string(),
    actionName: z.string().min(1).max(100),
    loggedAt: z.date(),
    problemId: problemSchema.shape.id.optional(),
    method: methodSchema.shape.id.optional(),
    step: stepSchema.shape.id.optional(),
    payload: z.string().optional(),
});

export type Event = z.infer<typeof eventSchema>;

export const insertEventSchema = eventSchema.pick({
    userId: true,
    sessionId: true,
    actionName: true,
    loggedAt: true,
    problemId: true,
    method: true,
    step: true,
    payload: true,
});
