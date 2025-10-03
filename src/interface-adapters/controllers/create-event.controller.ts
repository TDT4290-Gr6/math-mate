import { z } from "zod";
import { LogEventUseCase } from "@/application/use-cases/log-event.use-case";

const LogEventDTO = z.object({
  userId: z.number().int(),
  sessionId: z.string(),
  actionName: z.string().min(1).max(100),
  // Optional numeric FKs:
  problemId: z.number().int().optional(),
  methodId: z.number().int().optional(),
  stepId: z.number().int().optional(),
  // loggedAt is optional here; use case will default to now()
  loggedAt: z.coerce.date().optional(),
  // Your entity expects string; accept any and stringify if needed:
  payload: z.union([z.string(), z.any()]).optional(),
});

export class CreateEventController {
  constructor(private useCase: LogEventUseCase) {}

  async handle(raw: unknown) {
    const dto = LogEventDTO.parse(raw);

    // Ensure payload is string per your entity schema
    const payloadString =
      typeof dto.payload === "string" || dto.payload === undefined
        ? dto.payload
        : JSON.stringify(dto.payload);

    const out = await this.useCase.execute({
      userId: dto.userId,
      sessionId: dto.sessionId,
      actionName: dto.actionName,
      loggedAt: dto.loggedAt,          // may be undefined; use case fills now()
      problemId: dto.problemId,
      methodId: dto.methodId,
      stepId: dto.stepId,
      payload: payloadString,
    });

    return { status: 201, body: { id: out.id, loggedAt: out.loggedAt } };
  }
}
