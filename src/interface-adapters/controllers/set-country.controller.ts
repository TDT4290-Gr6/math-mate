import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { ISetCountryUseCase } from '@/application/use-cases/set-country.use-case';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';
export type ISetCountryController = ReturnType<typeof setCountryController>;

const inputSchema = z.object({ countryId: z.int() });

export const setCountryController =
    (
        setCountryUseCase: ISetCountryUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async (input: z.infer<typeof inputSchema>) => {
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated)
            throw new UnauthenticatedError('User must be logged in.');

        const id = await authenticationService.getCurrentUserId();
        if (id == null) throw new UnauthenticatedError('User id is not set.');

        // validate input
        const result = inputSchema.safeParse(input);

        if (!result.success) {
            // handle validation errors
            throw new InputParseError('Invalid input', { cause: result.error });
        }

        const { countryId } = result.data;

        // call use case
        await setCountryUseCase(id, countryId);

        return { success: true };
    };
