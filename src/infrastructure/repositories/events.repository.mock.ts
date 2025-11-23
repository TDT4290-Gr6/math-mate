import type { IEventsRepository } from '@/application/repositories/events.repository.interface';

import type { InsertEvent, Event } from '@/entities/models/event';

/**
 * Mock implementation of `IEventsRepository` for testing purposes.
 *
 * Stores events in memory instead of persisting to a real database.
 * Useful for unit tests, development, or simulating event logging.
 */
export class MockEventsRepository implements IEventsRepository {
    private _events: Event[] = [];
    private _idCounter = 1;

    /**
     * Creates a new event and stores it in memory.
     * Automatically assigns a unique incremental ID.
     *
     * @param event - The event data to insert.
     * @returns The created `Event` object with assigned ID.
     */
    async create(event: InsertEvent): Promise<Event> {
        const createdEvent: Event = {
            id: this._idCounter++,
            ...event,
        };

        this._events.push(createdEvent);
        return createdEvent;
    }

    /**
     * Retrieves all events stored in memory.
     *
     * @returns An array of `Event` objects.
     */
    async getAll(): Promise<Event[]> {
        return this._events;
    }

    /**
     * Clears the in-memory events store and resets ID counter.
     *
     * Useful for resetting state between tests.
     */
    clear() {
        this._events = [];
        this._idCounter = 1;
    }
}
