import { MockEventsRepository } from '@/infrastructure/repositories/events.repository.mock';
import { describe, it, beforeEach, expect } from 'vitest';
import { getInjection } from '@/di/container';

const logEventUseCase = getInjection('ILogEventUseCase');
const eventsRepo = getInjection('IEventsRepository') as MockEventsRepository;

describe('logEventUseCase', () => {
    beforeEach(() => {
        eventsRepo.clear();
    });

    it('creates and stores an event successfully', async () => {
        const now = new Date('2025-10-21T12:00:00Z');
        const result = await logEventUseCase.execute({
            userId: 1,
            sessionId: 100,
            actionName: 'SOLVE_PROBLEM',
            loggedAt: now,
            payload: '{"attempt":1}',
        });

        expect(result).toMatchObject({
            id: 1,
            userId: 1,
            sessionId: 100,
            actionName: 'SOLVE_PROBLEM',
            loggedAt: now,
        });

        const allEvents = await eventsRepo.getAll();
        expect(allEvents).toHaveLength(1);
    });

    it('adds a loggedAt timestamp if none is provided', async () => {
        const before = new Date();

        const result = await logEventUseCase.execute({
            userId: 1,
            sessionId: 42,
            actionName: 'USER_ACTION',
            payload: '{"some":"data"}',
        });

        const after = new Date();

        expect(result.loggedAt).toBeInstanceOf(Date);
        // Check that loggedAt was set between start and end of test
        expect(result.loggedAt.getTime()).toBeGreaterThanOrEqual(
            before.getTime(),
        );
        expect(result.loggedAt.getTime()).toBeLessThanOrEqual(after.getTime());

        const all = await eventsRepo.getAll();
        expect(all).toHaveLength(1);
        expect(all[0]).toMatchObject({
            id: 1,
            userId: 1,
            sessionId: 42,
            actionName: 'USER_ACTION',
        });
    });

    it('uses the provided loggedAt when present', async () => {
        const customDate = new Date('2025-10-21T12:00:00Z');

        const result = await logEventUseCase.execute({
            userId: 1,
            sessionId: 99,
            actionName: 'CUSTOM_LOG',
            loggedAt: customDate,
            payload: '{}',
        });

        expect(result.loggedAt).toEqual(customDate);
    });
});
