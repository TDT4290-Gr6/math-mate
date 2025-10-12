import { ILogEventUseCase } from '@/application/use-cases/log-event.use-case';
import { InputParseError } from '@/entities/errors/common';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { withRequestLogger } from '@/infrastructure/services/logging/request-logger';
import type { LoggerLike } from '@/application/use-cases/log-event.use-case';

const LogEventDTO = z.object({
    userId: z.number().int(),
    sessionId: z.number().int(),
    actionName: z.string().min(1).max(100),
    problemId: z.number().int().optional(),
    methodId: z.number().int().optional(),
    stepId: z.number().int().optional(),
    loggedAt: z.coerce.date().optional(),
    payload: z.string().optional(),
});

export type ICreateEventController = ReturnType<typeof createEventController>;

export const createEventController =
    (logEventUseCase: ILogEventUseCase) => async (raw: unknown) => {
        return withRequestLogger(async ({ log }) => {
            const l = log as unknown as LoggerLike;
            // Validate input med safeParse (try-catch alternativt)
            const { data, error } = LogEventDTO.safeParse(raw);

            if (error) {
                l.warn({ raw, err: error }, 'createEventController: invalid input');
                throw new InputParseError('Invalid input data', { cause: error });
            }

            // Sørg for at payload er string som forventet
            const payloadString =
                typeof data.payload === 'string'
                    ? data.payload
                    : JSON.stringify(data.payload);

            // Verify the user exists to avoid a DB foreign-key error later
            const user = await prisma.user.findUnique({ where: { id: data.userId } });
            if (!user) {
                l.warn({ userId: data.userId }, 'createEventController: user not found');
                throw new InputParseError('Invalid userId: user not found');
            }

            l.info({ userId: data.userId, action: data.actionName }, 'createEventController: request validated');

            // Kall use case med renset data
            try {
                const out = await logEventUseCase.execute(
                    {
                        userId: data.userId,
                        sessionId: data.sessionId,
                        actionName: data.actionName,
                        loggedAt: data.loggedAt,
                        problemId: data.problemId,
                        methodId: data.methodId,
                        stepId: data.stepId,
                        payload: payloadString,
                    },
                    { log: l },
                );

                l.info({ id: out.id }, 'createEventController: event created');

                // Returner formatert respons (kan justeres etter behov)
                return { status: 201, body: { id: out.id, loggedAt: out.loggedAt } };
            } catch (err) {
                l.error({ err }, 'createEventController: failed to create event');
                throw err;
            }
        });
    };
