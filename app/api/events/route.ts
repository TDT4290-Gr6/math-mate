import { getInjection } from '@/di/container';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth'; // adjust path to your NextAuth options

interface IEventController {
    handle: (
        body: unknown,
        ctx?: { userId?: number },
    ) => Promise<{ body: unknown; status: number } | unknown>;
}

/**
 * POST /api/events
 *
 * Logs a user event (e.g. interactions or analytics).
 * - Requires an authenticated NextAuth session.
 * - Injects `userId` into the controller context.
 * - Delegates to `ICreateEventController` for validation and persistence.
 */
export async function POST(request: Request) {
    const body = await request.json().catch(() => null);

    if (typeof body === 'undefined') {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    try {
        // Get authenticated session
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { error: 'Unauthenticated: missing user session' },
                { status: 401 },
            );
        }

        const userId = Number(session.user.id);

        // Get controller from DI
        const createEventController = getInjection('ICreateEventController');
        let result: { body: unknown; status: number };

        // Function-based controller
        if (typeof createEventController === 'function') {
            const controllerResult = await createEventController(body, {
                userId,
            });
            if (
                controllerResult &&
                typeof controllerResult === 'object' &&
                'body' in controllerResult &&
                'status' in controllerResult
            ) {
                result = controllerResult;
            } else {
                result = { body: controllerResult, status: 200 };
            }
        }
        // Object-based controller
        else if (
            createEventController &&
            typeof (createEventController as IEventController).handle ===
                'function'
        ) {
            const controllerResult = await (
                createEventController as IEventController
            ).handle(body, { userId });

            if (
                controllerResult &&
                typeof controllerResult === 'object' &&
                'body' in controllerResult &&
                'status' in controllerResult
            ) {
                result = controllerResult as { body: unknown; status: number };
            } else {
                result = { body: controllerResult, status: 200 };
            }
        } else {
            throw new Error('createEventController is not callable');
        }

        return NextResponse.json(result.body, { status: result.status });
    } catch (err: unknown) {
        const e = err as { name?: string; message?: string; status?: number };
        const status =
            typeof e?.status === 'number'
                ? e.status
                : e?.name === 'InputParseError'
                  ? 400
                  : 500;
        const message = e?.message ?? 'Unknown error';
        console.error('POST /api/events error:', err);
        return NextResponse.json({ error: message }, { status });
    }
}
