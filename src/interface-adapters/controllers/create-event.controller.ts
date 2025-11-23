import type { IAuthenticationService } from '@/application/services/auth.service.interface';
import { ILogEventUseCase } from '@/application/use-cases/log-event.use-case';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';

const LogEventDTO = z.object({
    sessionId: z.number().int(),
    actionName: z.string().min(1).max(100),
    problemId: z.number().int().optional(),
    methodId: z.number().int().optional(),
    stepId: z.number().int().optional(),
    payload: z.string().optional(),
});

export type ICreateEventController = ReturnType<typeof createEventController>;

/**
 * Factory function that creates the `createEventController`.
 *
 * @param logEventUseCase - Use case responsible for logging events in the system.
 * @param authenticationService - Service to obtain the current authenticated user's ID.
 * @returns A controller function that validates input, ensures the user is authenticated,
 *          logs the event, and returns the created event's ID and timestamp.
 *
 * @throws InputParseError - If the input fails validation.
 *
 * @example
 * const controller = createEventController(logEventUseCase, authService);
 * const result = await controller({
 *   sessionId: 1,
 *   actionName: 'view_problem',
 *   problemId: 123,
 *   payload: '{"extra":"data"}'
 * });
 * // result -> { id: 42, loggedAt: 2025-11-23T10:15:00.000Z }
 */
export const createEventController =
    (
        logEventUseCase: ILogEventUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async (raw: unknown) => {
        // Validate input
        const parsed = LogEventDTO.safeParse(raw);
        if (!parsed.success) {
            throw new InputParseError('Invalid input data', {
                cause: parsed.error,
            });
        }

        const data = parsed.data;
        const userId = await authenticationService.getCurrentUserId();
        if (userId === null) {
            // This might happen if the user navigates to a page they are not authorized to visit
            // They will be redirected, but we do not need to throw an error here
            console.error('Unauthenticated user tried to log event', { data });
            return null;
        }

        // Ensure that payload is string
        const payloadString =
            typeof data.payload === 'string'
                ? data.payload
                : JSON.stringify(data.payload);

        const out = await logEventUseCase.execute({
            userId,
            sessionId: data.sessionId,
            actionName: data.actionName,
            loggedAt: new Date(),
            problemId: data.problemId,
            methodId: data.methodId,
            stepId: data.stepId,
            payload: payloadString,
        });

        return { id: out.id, loggedAt: out.loggedAt };
    };
