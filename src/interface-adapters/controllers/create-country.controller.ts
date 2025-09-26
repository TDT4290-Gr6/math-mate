import { ICreateCountryUseCase } from '@/src/application/use-cases/create-country.use-case';
import { Country } from '@/src/entities/models/country';

function presenter(countries: Country[]) {
    return countries.map((country) => ({
        id: country.id,
        name: country.name,
    }));
}

export type ICreateCountryController = ReturnType<
    typeof createCountryController
>;

export const createCountryController =
    (createCountryUseCase: ICreateCountryUseCase) => async (input: string) => {
        // check authentication

        // validate input
        console.log('Input:', input);
        const country = await createCountryUseCase(input);
        return presenter([country]);
        // call use case
    };
