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
