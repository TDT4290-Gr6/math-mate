import { ICreateCountryUseCase } from '@/application/use-cases/create-country.use-case';
import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { countryPresenter } from '../presenters/country.presenter';
import { UnauthenticatedError } from '@/entities/errors/auth';
import { InputParseError } from '@/entities/errors/common';
import { z } from 'zod';

const inputSchema = z.object({
    name: z
        .string()
        .min(1)
        .regex(
            /^[\p{L}\s'-]+$/u,
            'Country name must contain only letters, spaces, hyphens, or apostrophes',
        ),
});

export type ICreateCountryController = ReturnType<
    typeof createCountryController
>;

/**
 * Factory function that creates the `createCountryController`.
 *
 * @param createCountryUseCase - The use case responsible for creating a new country.
 * @param authenticationService - Service used to verify the current user's authentication status.
 * @returns A controller function that accepts input, validates it, checks authentication,
 *          invokes the use case, and returns a formatted response.
 *
 * @throws UnauthenticatedError - If the user is not authenticated.
 * @throws InputParseError - If the input fails validation.
 *
 * @example
 * const controller = createCountryController(createCountryUseCase, authService);
 * const response = await controller({ name: 'Germany' });
 */
export const createCountryController =
    (
        createCountryUseCase: ICreateCountryUseCase,
        authenticationService: IAuthenticationService,
    ) =>
    async (input: z.infer<typeof inputSchema>) => {
        // check authentication
        const isAuthenticated = await authenticationService.isAuthenticated();
        if (!isAuthenticated) {
            throw new UnauthenticatedError('User must be logged in.');
        }

        // validate input
        const { data, error: inputParseError } = inputSchema.safeParse(input);

        if (inputParseError) {
            throw new InputParseError('Invalid data', {
                cause: inputParseError,
            });
        }

        const { name } = data;

        // call use case
        const country = await createCountryUseCase(name);

        // format output
        return countryPresenter([country]);
    };
