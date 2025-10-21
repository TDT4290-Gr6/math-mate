import { it, expect } from 'vitest';
import { getInjection } from '@/di/container';
import { InputParseError } from '@/entities/errors/common';

const signInUseCase = getInjection('ISignInUseCase');
const createCountryUseCase = getInjection('ICreateCountryUseCase');
const setCountryUseCase = getInjection('ISetCountryUseCase');

it('sets country for authenticated user', async () => {
  //arrange
    const user = await signInUseCase('user-uuid-1');
  const country = await createCountryUseCase('Norway');

  // act + assert
  await expect(setCountryUseCase(user.id, country.id)).resolves.toMatchObject({
    id: user.id,
    countryId: country.id,
  })
});

it('throws InputParseError when country does not exist', async () => {
  // arrange
  const user = await signInUseCase('user-uuid-1');
  const country = await createCountryUseCase('Norway');

  // act + assert
  await expect(setCountryUseCase(user.id, 999)).rejects.toThrow(InputParseError);
});

it('throws InputParseError when user does not exist', async () => {
  // arrange
  const country = await createCountryUseCase('India');
  const user = await signInUseCase('user-uuid-1');

  // act + assert
  await expect(setCountryUseCase(999, country.id)).rejects.toThrow(InputParseError);
});

