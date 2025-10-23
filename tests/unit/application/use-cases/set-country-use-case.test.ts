import { InputParseError } from '@/entities/errors/common';
import { getInjection } from '@/di/container';
import { it, expect } from 'vitest';

const signInUseCase = getInjection('ISignInUseCase');
const createCountryUseCase = getInjection('ICreateCountryUseCase');
const setCountryUseCase = getInjection('ISetCountryUseCase');

it('sets country for authenticated user', async () => {
    const user = await signInUseCase('user-uuid-1');
    const country = await createCountryUseCase('Norway');

    await expect(setCountryUseCase(user.id, country.id)).resolves.toMatchObject(
        {
            id: user.id,
            countryId: country.id,
        },
    );
});

it('throws InputParseError when country does not exist', async () => {
    const user = await signInUseCase('user-uuid-1');

    await expect(setCountryUseCase(user.id, 999)).rejects.toThrow(
        InputParseError,
    );
});

it('throws InputParseError when user does not exist', async () => {
    const country = await createCountryUseCase('India');

    await expect(setCountryUseCase(999, country.id)).rejects.toThrow(
        InputParseError,
    );
});
