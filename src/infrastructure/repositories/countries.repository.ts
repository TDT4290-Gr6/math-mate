import { ICountriesRepository } from '@/application/repositories/countries.repository.interface';
import { CountryInsert, Country } from '@/entities/models/country';
import { DatabaseOperationError } from '@/entities/errors/common';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Repository class for managing country entities in the database.
 *
 * Provides methods to create a new country, retrieve all countries,
 * and fetch a country by its unique identifier.
 *
 * @implements {ICountriesRepository}
 */
export class CountriesRepository implements ICountriesRepository {
    /**
     * Creates a new country record in the database.
     *
     * @param country - The data for the country to be inserted.
     * @returns A promise that resolves to the created {@link Country} object.
     * @throws {DatabaseOperationError} If the country creation fails due to a known Prisma client error.
     * @throws {Error} If an unexpected error occurs during the operation.
     */
    async createCountry(country: CountryInsert): Promise<Country> {
        try {
            const createdCountry = await prisma.country.create({
                data: country,
            });

            return createdCountry;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError('Failed to create country', {
                    cause: error,
                });
            }
            throw error;
        }
    }

    /**
     * Retrieves all countries from the database.
     *
     * @returns {Promise<Country[]>} A promise that resolves to an array of `Country` objects.
     * @throws {DatabaseOperationError} If a known Prisma client error occurs during retrieval.
     * @throws {Error} If an unknown error occurs.
     */
    async getAllCountries(): Promise<Country[]> {
        try {
            const countries = await prisma.country.findMany();
            return countries;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError(
                    'Failed to retrieve countries',
                    {
                        cause: error,
                    },
                );
            }
            throw error;
        }
    }

    /**
     * Retrieves a country by its unique identifier.
     *
     * @param id - The unique identifier of the country to retrieve.
     * @returns A promise that resolves to the `Country` object if found, or `null` if no country exists with the given ID.
     * @throws {DatabaseOperationError} If a known Prisma client request error occurs during the database operation.
     * @throws {Error} If an unexpected error occurs.
     */
    async getCountryById(id: number): Promise<Country | null> {
        try {
            const country = await prisma.country.findUnique({
                where: { id },
            });
            return country;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw new DatabaseOperationError(
                    'Failed to retrieve country by ID',
                    {
                        cause: error,
                    },
                );
            }
            throw error;
        }
    }
}
