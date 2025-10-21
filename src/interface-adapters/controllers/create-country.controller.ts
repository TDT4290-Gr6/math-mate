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
            /^[A-Za-z\s-]+$/,
            'Country name must contain only letters, spaces, or hyphens',
        ),
});

export type ICreateCountryController = ReturnType<
    typeof createCountryController
>;

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
