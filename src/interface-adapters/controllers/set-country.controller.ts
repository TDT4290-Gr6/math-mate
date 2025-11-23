import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { ISetCountryUseCase } from '@/application/use-cases/set-country.use-case';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';
export type ISetCountryController = ReturnType<typeof setCountryController>;

const inputSchema = z.object({ countryId: z.int().positive() });

/**
 * Factory function that creates the `setCountryController`.
 *
 * @param setCountryUseCase - Use case to associate a user with a country.
 * @param authenticationService - Service to verify if the user is authenticated and obtain their ID.
 * @returns A controller function that:
 *   - Ensures the user is authenticated,
 *   - Retrieves the current user's ID from the authentication service,
 *   - Validates the input country ID,
 *   - Calls the use case to set the user's country.
 *
 * @throws UnauthenticatedError - If the user is not logged in or user ID is not set.
 * @throws InputParseError - If the input country ID is invalid.
 *
 * @example
 * const controller = setCountryController(setCountryUseCase, authService);
 * const result = await controller({ countryId: 3 });
 * // result: { success: true }
 */
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
