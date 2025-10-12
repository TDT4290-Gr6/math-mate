import { logger } from './logger';
import { nanoid } from 'nanoid';
export function withRequestLogger<T>(
    fn: (ctx: { log: unknown }) => Promise<T>,
) {
    const child = logger.child({ reqId: nanoid(10) });
    return fn({ log: child });
}
