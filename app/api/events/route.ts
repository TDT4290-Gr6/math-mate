import { NextResponse } from 'next/server';
import { container } from '@/di/container';
import { DI_SYMBOLS } from '@/di/types';

export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    try {
        const createEventController = container.get(DI_SYMBOLS.ICreateEventController);

        let result: { body: unknown; status: number };

        // Controller may be a function (HOF) or an object with a .handle method depending on DI wiring
        if (typeof createEventController === 'function') {
            const controllerResult = await createEventController(body);
            if (controllerResult && typeof controllerResult === 'object' && 'body' in controllerResult && 'status' in controllerResult) {
                result = controllerResult;
            } else {
                result = { body: controllerResult, status: 200 };
            }
        } else if (createEventController && typeof (createEventController as any).handle === 'function') {
            const controllerResult = await (createEventController as any).handle(body);
            if (controllerResult && typeof controllerResult === 'object' && 'body' in controllerResult && 'status' in controllerResult) {
                result = controllerResult;
            } else {
                result = { body: controllerResult, status: 200 };
            }
        } else {
            throw new Error('createEventController is not callable');
        }

        return NextResponse.json(result.body, { status: result.status });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('POST /api/events error:', err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
