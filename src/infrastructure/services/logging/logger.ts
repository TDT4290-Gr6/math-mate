import pino from "pino";
export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  base: undefined,
  transport: process.env.NODE_ENV === "production" ? undefined : {
    target: "pino-pretty",
    options: { colorize: true, singleLine: true, translateTime: "SYS:standard" }
  },
});
