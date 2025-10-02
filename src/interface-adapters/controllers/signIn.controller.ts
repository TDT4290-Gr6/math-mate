import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { ICreateUserUseCase } from '@/application/use-cases/create-user.use-case';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';

const inputSchema = z.object({
    uuid: z.uuid(),
});

export const signInController =
    (
        createUserUseCase: ICreateUserUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async (input: z.infer<typeof inputSchema>) => {
        // SignInController only syncs the user with the database, session handling is done by the authentication service
        // check authentication
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated) {
            throw new UnauthenticatedError('User must be logged in.');
        }
        // validate input
        const result = inputSchema.safeParse(input);

        if (!result.success) {
            // handle validation errors
            throw new InputParseError('Invalid input');
        }

        // call use case
        const { uuid } = result.data;
        const userId = await createUserUseCase(uuid);

        return { userId: userId };
    };
