import pino from 'pino';
// NOTE: pino-pretty's transport can fail to resolve in some bundler/dev
// environments (Turbopack/Next.js). Keep the logger simple and avoid
// configuring the transport at module-evaluation time to prevent runtime
// errors like "unable to determine transport target for 'pino-pretty'".
export const logger = pino({
    level: process.env.LOG_LEVEL ?? 'info',
    base: undefined,
    // transport intentionally omitted here. If you want pretty logs in
    // development, initialize a runtime-only transport (e.g. spawn a
    // child process or create the logger inside a function that runs at
    // runtime where `require.resolve('pino-pretty')` is available).
});
