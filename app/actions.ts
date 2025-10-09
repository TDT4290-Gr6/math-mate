'use server';

import { getInjection } from '@/di/container';

export async function getCountries() {
    const getCountriesController = getInjection('IGetCountriesController');
    return getCountriesController();
}
