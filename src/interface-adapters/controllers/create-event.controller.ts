import { ILogEventUseCase } from '@/application/use-cases/log-event.use-case';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';

const LogEventDTO = z.object({
    userId: z.number().int(),
    sessionId: z.string(),
    actionName: z.string().min(1).max(100),
    problemId: z.number().int().optional(),
    methodId: z.number().int().optional(),
    stepId: z.number().int().optional(),
    loggedAt: z.coerce.date().optional(),
    payload: z.union([z.string(), z.any()]).optional(),
});

export type ICreateEventController = ReturnType<typeof createEventController>;

export const createEventController =
    (logEventUseCase: ILogEventUseCase) => async (raw: unknown) => {
        // Validate input med safeParse (try-catch alternativt)
        const { data, error } = LogEventDTO.safeParse(raw);

        if (error) {
            throw new InputParseError('Invalid input data', { cause: error });
        }

        // Sørg for at payload er string som forventet
        const payloadString =
            typeof data.payload === 'string' || data.payload === undefined
                ? data.payload
                : JSON.stringify(data.payload);

        // Kall use case med renset data
        const out = await logEventUseCase.execute({
            userId: data.userId,
            sessionId: data.sessionId,
            actionName: data.actionName,
            loggedAt: data.loggedAt,
            problemId: data.problemId,
            methodId: data.methodId,
            stepId: data.stepId,
            payload: payloadString,
        });

        // Returner formatert respons (kan justeres etter behov)
        return { status: 201, body: { id: out.id, loggedAt: out.loggedAt } };
    };
