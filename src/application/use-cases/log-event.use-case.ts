import type {
    IEventsRepository,
    InsertEvent,
} from '@/application/repositories/events.repository.interface';
import { insertEventSchema } from '@/entities/models/event';
import type { Event } from '@/entities/models/event';

// Minimal interface for a logger with the methods we use in the codebase.
// This avoids pulling pino's generic-heavy types into many modules.
export type LoggerLike = {
    info: (...args: unknown[]) => unknown;
    warn: (...args: unknown[]) => unknown;
    error: (...args: unknown[]) => unknown;
    debug?: (...args: unknown[]) => unknown;
    child?: (...args: unknown[]) => unknown;
};

export type ILogEventUseCase = ReturnType<typeof LogEventUseCase>;

// Add optional `log` parameter to `execute` so callers can inject a
// request-scoped logger (child of the global logger). Falls back to the
// global logger when not provided.
export const LogEventUseCase = (eventRepository: IEventsRepository) => ({
    async execute(
        input: InsertEvent | Omit<InsertEvent, 'loggedAt'>,
    options?: { log?: LoggerLike },
    ): Promise<Event> {
        const log = options?.log;

        const start = Date.now();
        log?.info({ action: input.actionName }, 'LogEventUseCase.execute start');

        // Ensure we always have a timestamp, but keep DB column name 'logged_at'
        const withDefaults: InsertEvent = {
            ...input,
            loggedAt: (input as InsertEvent).loggedAt ?? new Date(),
        } as InsertEvent;

        // Validate against your zod schema from entities/models/event.ts
        const valid = insertEventSchema.parse(withDefaults);

        try {
            const created = await eventRepository.create(valid);
            log?.info(
                { id: created.id, durationMs: Date.now() - start },
                'LogEventUseCase.execute success',
            );
            return created;
        } catch (err) {
            log?.error({ err }, 'LogEventUseCase.execute failed');
            throw err;
        }
    },
});
