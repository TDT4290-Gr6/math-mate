import { problemSchema } from './problem';
import { methodSchema } from './method';
import { userSchema } from './user';
import { stepSchema } from './step';
import { z } from 'zod';

/**
 * Zod schema representing an event in the system.
 *
 * - `id`: Unique identifier of the event.
 * - `userId`: ID of the user associated with the event.
 * - `sessionId`: ID of the session during which the event occurred.
 * - `actionName`: Name of the action (1-100 characters).
 * - `loggedAt`: Timestamp of when the event was logged.
 * - `problemId`: Optional ID of the related problem.
 * - `methodId`: Optional ID of the related method.
 * - `stepId`: Optional ID of the related step.
 * - `payload`: Arbitrary string data related to the event.
 */
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

/** Type representing a validated `Event` object. */
export type Event = z.infer<typeof eventSchema>;

/**
 * Zod schema for inserting a new event.
 *
 * Only requires the fields necessary for creating an event record.
 */
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

/** Type representing the data required to insert a new event. */
export type InsertEvent = z.infer<typeof insertEventSchema>;
