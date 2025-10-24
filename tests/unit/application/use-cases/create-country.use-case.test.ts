import { getInjection } from 'di/container';
import { expect, it } from 'vitest';

const createCountryUseCase = getInjection('ICreateCountryUseCase');

it('creates country', async () => {
    await expect(createCountryUseCase('Norway')).resolves.toMatchObject({
        name: 'Norway',
    });
});
