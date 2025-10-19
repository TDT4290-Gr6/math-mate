import type {
    IEventsRepository
} from '@/application/repositories/events.repository.interface';
import type { Event, InsertEvent} from '@/entities/models/event';
import { prisma } from '@/lib/prisma';

export class EventsRepository implements IEventsRepository {
    async create(event: InsertEvent): Promise<Event> {
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
    }
}
