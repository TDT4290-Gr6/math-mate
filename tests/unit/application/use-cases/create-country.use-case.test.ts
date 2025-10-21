import {expect, it} from 'vitest';
import { getInjection } from 'di/container';

const createCountryUseCase = getInjection('ICreateCountryUseCase');

it('creates country', async () => {
  await expect(createCountryUseCase('Norway')).resolves.toMatchObject({
    name: 'Norway',
  });
});



