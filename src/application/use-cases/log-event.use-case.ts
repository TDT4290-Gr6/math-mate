import type {
    IEventsRepository,
    InsertEvent,
} from '@/application/repositories/events.repository.interface';
import { insertEventSchema } from '@/entities/models/event';
import type { Event } from '@/entities/models/event';

export class LogEventUseCase {
    constructor(private repo: IEventsRepository) {}

    async execute(
        input: InsertEvent | Omit<InsertEvent, 'loggedAt'>,
    ): Promise<Event> {
        // Ensure we always have a timestamp, but keep DB column name 'logged_at'
        const withDefaults: InsertEvent = {
            loggedAt: (input as InsertEvent).loggedAt ?? new Date(),
            ...input,
        } as InsertEvent;

        // Validate against your zod schema from entities/models/event.ts
        const valid = insertEventSchema.parse(withDefaults);

        // Repo persists and returns the full Event (with id, created fields mapped)
        return this.repo.create(valid);
    }
}
