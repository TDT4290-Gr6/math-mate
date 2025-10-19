import type { IEventsRepository } from '@/application/repositories/events.repository.interface';
import type { Event, InsertEvent } from '@/entities/models/event';
import { insertEventSchema } from '@/entities/models/event';

export type ICreateEventUseCase = ReturnType<typeof CreateEventUseCase>;

export const CreateEventUseCase = (eventRepository: IEventsRepository) => ({
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
    },
});
