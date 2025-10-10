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

export async function getCountry(userId: number) {
    try {
        const getUserController = getInjection('IGetUserController');
        const user = await getUserController({ id: userId });
        return user.countryId;
    } catch (error) {
        console.error('Failed to get country for user:', userId, error);
        throw error;
    }
}

export async function setCountry(userId: number, countryId: number) {
    try {
        const setCountryController = getInjection('ISetCountryController');
        return await setCountryController({ id: userId, countryId });
    } catch (error) {
        console.error('Failed to set country:', error);
        throw error;
    }
}
