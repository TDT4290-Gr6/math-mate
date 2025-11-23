import type { IEventsRepository } from '@/application/repositories/events.repository.interface';
import type { Event, InsertEvent } from '@/entities/models/event';
import { insertEventSchema } from '@/entities/models/event';

export type ILogEventUseCase = ReturnType<typeof LogEventUseCase>;

/**
 * Factory function that creates the `LogEventUseCase`.
 *
 * This use case is responsible for logging events by validating the input,
 * adding default values if necessary, and persisting the event using
 * the provided events repository.
 *
 * @param eventRepository - An implementation of `IEventsRepository` used to persist events.
 * @returns An object containing the `execute` function, which logs a new event.
 *
 * @example
 * const logEvent = LogEventUseCase(eventsRepository);
 * const event = await logEvent.execute({ sessionId: 1, actionName: "chat_message_sent", payload: "{}" });
 */
export const LogEventUseCase = (eventRepository: IEventsRepository) => ({
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

        try {
            const created = await eventRepository.create(valid);
            return created;
        } catch (err) {
            throw err;
        }
    },
});
