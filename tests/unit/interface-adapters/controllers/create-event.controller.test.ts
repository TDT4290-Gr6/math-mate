import { describe, it, beforeEach, expect} from 'vitest';
import { getInjection } from '@/di/container';
import { InputParseError } from '@/entities/errors/common';
import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { MockEventsRepository } from '@/infrastructure/repositories/events.repository.mock';

const createEventController = getInjection('ICreateEventController');
const authService = getInjection('IAuthenticationService') as MockAuthenticationService;
const eventsRepo = getInjection('IEventsRepository') as MockEventsRepository;

describe('create-event.controller', () => {
    beforeEach(() => {
        authService.setAuthenticated(true);
        authService.setCurrentUserId(1);
        eventsRepo.clear();
    });

    describe('authentication', () => {
        it('returns null when user is not authenticated', async () => {
            authService.setCurrentUserId(null);

            const result = await createEventController({
                sessionId: 1,
                actionName: 'CLICK',
            });

            expect(result).toBeNull();
        });
    });

    describe('input validation', () => {
        it('throws InputParseError for missing sessionId', async () => {
            await expect(
                createEventController({ actionName: 'CLICK' }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for missing actionName', async () => {
            await expect(
                createEventController({ sessionId: 1 }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for empty actionName', async () => {
            await expect(
                createEventController({ sessionId: 1, actionName: '' }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError for non-integer sessionId', async () => {
            await expect(
                createEventController({ sessionId: 1.5, actionName: 'CLICK' }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError when sessionId is a string', async () => {
            await expect(
                createEventController({ sessionId: '123', actionName: 'CLICK' }),
            ).rejects.toBeInstanceOf(InputParseError);
        });

        it('throws InputParseError when actionName exceeds 100 characters', async () => {
            const longActionName = 'A'.repeat(101);

            await expect(
                createEventController({ sessionId: 1, actionName: longActionName }),
            ).rejects.toBeInstanceOf(InputParseError);
        });
    });
});

