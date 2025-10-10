'use server';

import { getInjection } from '@/di/container';

export async function getCountries() {
    const getCountriesController = getInjection('IGetCountriesController');
    return getCountriesController();
}

export async function setCountry(userId: number, countryId: number) {
    const setCountryController = getInjection('ISetCountryController');
    return setCountryController({ id: userId, countryId: countryId });
}
