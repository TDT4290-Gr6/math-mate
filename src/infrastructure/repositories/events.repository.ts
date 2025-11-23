import type { IEventsRepository } from '@/application/repositories/events.repository.interface';
import { DatabaseOperationError } from '@/entities/errors/common';
import type { Event, InsertEvent } from '@/entities/models/event';
import { prisma } from '@/lib/prisma';
/**
 * Repository implementation for `Event` entities using Prisma.
 *
 * Handles persistence of events in a real database.
 */
export class EventsRepository implements IEventsRepository {
    /**
     * Creates a new event in the database.
     *
     * @param event - The event data to insert.
     * @returns A promise that resolves to the created `Event`.
     * @throws {DatabaseOperationError} When database insertion fails.
     */
    async create(event: InsertEvent): Promise<Event> {
        try {
            const created = await prisma.event.create({
                data: {
                    userId: event.userId,
                    sessionId: event.sessionId,
                    actionName: event.actionName,
                    loggedAt: event.loggedAt,
                    problemId: event.problemId ?? null,
                    methodId: event.methodId ?? null,
                    stepId: event.stepId ?? null,
                    payload: event.payload,
                },
            });

            return {
                id: created.id,
                userId: created.userId,
                sessionId: created.sessionId,
                actionName: created.actionName,
                loggedAt: created.loggedAt,
                problemId: created.problemId ?? undefined,
                methodId: created.methodId ?? undefined,
                stepId: created.stepId ?? undefined,
                payload: created.payload ?? undefined,
            } as Event;
        } catch (error) {
            throw new DatabaseOperationError('Failed to create event', {
                cause: error,
            });
        }
    }
}
