import { ICreateCountryUseCase } from '@/application/use-cases/create-country.use-case';
import { container } from '@/di/container';
import { DI_SYMBOLS } from '@/di/types';
import { it } from 'vitest';

const createCountryUseCase = container.get(
    DI_SYMBOLS.ICreateCountryUseCase,
) as ICreateCountryUseCase;

it('createCountry', async () => {
    const country = await createCountryUseCase('Switzerland');
    console.log(country);
});
