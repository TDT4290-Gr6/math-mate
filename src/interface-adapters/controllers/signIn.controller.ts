import { ISignInUseCase } from '@/application/use-cases/sign-in.use-case';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';

const inputSchema = z.object({
    uuid: z.string(),
});

export type ISignInController = ReturnType<typeof signInController>;

/**
 * Factory function that creates the `signInController`.
 *
 * @param signInUseCase - Use case responsible for signing in or creating a user in the database.
 * @returns A controller function that:
 *   - Validates the input UUID,
 *   - Calls the sign-in use case to sync the user with the database,
 *   - Returns the signed-in user's ID.
 *
 * @throws InputParseError - If the input UUID is invalid.
 *
 * @example
 * const controller = signInController(signInUseCase);
 * const result = await controller({ uuid: "12345-uuid-from-nextauth" });
 * // result: { userId: 1 }
 */
export const signInController =
    (signInUseCase: ISignInUseCase) =>
    async (input: z.infer<typeof inputSchema>) => {
        // SignInController only syncs the user with the database, session handling is done by the authentication service
        // check authentication
        console.log('signInController input', input);
        // validate input
        const result = inputSchema.safeParse(input);

        if (!result.success) {
            // handle validation errors
            throw new InputParseError('Invalid input', { cause: result.error });
        }

        // call use case
        const { uuid } = result.data;
        const user = await signInUseCase(uuid);

        return { userId: user.id };
    };
