import type {
    IEventsRepository,
    InsertEvent,
} from '@/application/repositories/events.repository.interface';
import { insertEventSchema } from '@/entities/models/event';
import type { Event } from '@/entities/models/event';

export type ILogEventUseCase = ReturnType<typeof LogEventUseCase>;

export const LogEventUseCase =
    (eventRepository: IEventsRepository) => ({
        async execute(
            input: InsertEvent | Omit<InsertEvent, 'loggedAt'>,
        ): Promise<Event> {
            // Ensure we always have a timestamp, but keep DB column name 'logged_at'
            const withDefaults: InsertEvent = {
                ...input,
                loggedAt: (input as InsertEvent).loggedAt ?? new Date(),
            } as InsertEvent;

            // Validate against your zod schema from entities/models/event.ts
            const valid = insertEventSchema.parse(withDefaults);

            // Repo persists and returns the full Event (with id, created fields mapped)
            return await eventRepository.create(valid);
        }
    });

