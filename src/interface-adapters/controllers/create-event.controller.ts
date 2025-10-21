import type { IAuthenticationService } from '@/application/services/auth.service.interface';
import { withRequestLogger } from '@/infrastructure/services/logging/request-logger';
import { ILogEventUseCase } from '@/application/use-cases/log-event.use-case';
import type { LoggerLike } from '@/application/use-cases/log-event.use-case';
import { UnauthenticatedError } from '@/entities/errors/auth';
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

export const createEventController =
    (
        logEventUseCase: ILogEventUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async (raw: unknown) => {
        return withRequestLogger(async ({ log }) => {
            const l = log as LoggerLike;
            // Validate input
            const parsed = LogEventDTO.safeParse(raw);
            if (!parsed.success) {
                l.warn(
                    { raw, err: parsed.error },
                    'createEventController: invalid input',
                );
                throw new InputParseError('Invalid input data', {
                    cause: parsed.error,
                });
            }

            const data = parsed.data;
            const userId = await authenticationService.getCurrentUserId();
            if (userId === null)
                throw new UnauthenticatedError('User must be logged in.');

            // Ensure that payload is string
            const payloadString =
                typeof data.payload === 'string'
                    ? data.payload
                    : JSON.stringify(data.payload);

            l.info(
                { userId, action: data.actionName },
                'createEventController: request validated',
            );

            // Call use case with cleaned data
            try {
                const out = await logEventUseCase.execute(
                    {
                        userId,
                        sessionId: data.sessionId,
                        actionName: data.actionName,
                        loggedAt: new Date(),
                        problemId: data.problemId,
                        methodId: data.methodId,
                        stepId: data.stepId,
                        payload: payloadString,
                    },
                    { log: l },
                );

                l.info({ id: out.id }, 'createEventController: event created');

                return { id: out.id, loggedAt: out.loggedAt };
            } catch (err) {
                l.error(
                    { err },
                    'createEventController: failed to create event',
                );
                throw err;
            }
        });
    };
