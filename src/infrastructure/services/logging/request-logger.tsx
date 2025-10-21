import { nanoid } from 'nanoid';
export function withRequestLogger<T>(
    fn: (ctx: { reqId: string }) => Promise<T>,
    ) {
    const reqId = nanoid(10);
    return fn({ reqId });
}