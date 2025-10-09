import { ICountriesRepository } from '@/application/repositories/countries.repository.interface';
import { CountryInsert, Country } from '@/entities/models/country';
import { prisma } from '@/lib/prisma';

export class CountriesRepository implements ICountriesRepository {
    async createCountry(country: CountryInsert): Promise<Country> {
        const createdCountry = await prisma.country.create({
            data: country,
        });

        return createdCountry;
    }

    async getAllCountries(): Promise<Country[]> {
        const countries = await prisma.country.findMany();
        return countries;
    }

    async getCountryById(id: number): Promise<Country | null> {
        const country = await prisma.country.findUnique({
            where: { id },
        });
        return country;
    }
}
