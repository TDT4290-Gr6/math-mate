import type { IEventsRepository, InsertEvent } from '@/application/repositories/events.repository.interface';
import type { Event } from '@/entities/models/event';
import { prisma } from '@/lib/prisma';

export class EventsRepository implements IEventsRepository {
    async create(event: InsertEvent): Promise<Event> {
        const created = await prisma.event.create({
            data: {
                userId: BigInt(event.userId),
                sessionId: event.sessionId,
                actionName: event.actionName,
                loggedAt: event.loggedAt,
                problemId: event.problemId ? BigInt(event.problemId) : null,
                methodId: event.methodId ? BigInt(event.methodId) : null,
                stepId: event.stepId ? BigInt(event.stepId) : null,
                payload: event.payload ?? null,
            },
        });

        return {
            id: Number(created.id),
            userId: Number(created.userId),
            sessionId: String(created.sessionId),
            actionName: created.actionName,
            loggedAt: new Date(created.loggedAt),
            problemId: created.problemId ? Number(created.problemId) : undefined,
            methodId: created.methodId ? Number(created.methodId) : undefined,
            stepId: created.stepId ? Number(created.stepId) : undefined,
            payload: created.payload ?? undefined,
        } as Event;
    }
}
