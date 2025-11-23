import type { Event, InsertEvent } from '@/entities/models/event';

/**
 * Interface for performing CRUD operations on event data.
 */
export interface IEventsRepository {
    /**
     * Creates a new event record in the repository.
     *
     * @param event - The event data to insert.
     * @returns A promise that resolves to the newly created Event object.
     */
    create(event: InsertEvent): Promise<Event>;
}
