import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { IGetUserUseCase } from '@/application/use-cases/get-user.use-case';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { userPresenter } from '../presenters/user.presenter';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';

export type IGetUserController = ReturnType<typeof getUserController>;

const inputSchema = z.object({ id: z.int() });

export const getUserController =
    (
        getUserUseCase: IGetUserUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async (input: z.infer<typeof inputSchema>) => {
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated) {
            throw new UnauthenticatedError('User must be logged in.');
        }

        const result = inputSchema.safeParse(input);

        if (!result.success) {
            // handle validation errors
            throw new InputParseError('Invalid input', { cause: result.error });
        }

        const { id } = result.data;
        const user = await getUserUseCase(id);
        if (!user) {
            throw new InputParseError('User not found');
        }

        return userPresenter(user);
    };
