'use server';

import { getInjection } from '@/di/container';
import { Problem } from './types';

export async function getProblems(
    offset: number,
    limit: number,
    subjects: string[],
): Promise<Problem[]> {
    const getProblemsController = getInjection('IGetProblemsController');
    const problems = getProblemsController({ offset, limit, subjects });
    return problems;


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
