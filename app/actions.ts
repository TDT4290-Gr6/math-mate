'use server';

import { getInjection } from '@/di/container';

export async function getCountries() {
    try {
        const getCountriesController = getInjection('IGetCountriesController');
        return await getCountriesController();
    } catch (error) {
        console.error('Failed to get countries:', error);
        throw error;
    }
}

export async function getCountry() {
    try {
        const getUserController = getInjection('IGetUserController');
        const user = await getUserController();
        return user.countryId;
    } catch (error) {
        console.error('Failed to get country for current user:', error);
        throw error;
    }
}

export async function setCountry(countryId: number) {
    try {
        const setCountryController = getInjection('ISetCountryController');
        return await setCountryController({ countryId });
    } catch (error) {
        console.error('Failed to set country for current user:', error);
        throw error;
    }
}
