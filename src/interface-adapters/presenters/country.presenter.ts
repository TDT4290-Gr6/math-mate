import { Country } from '@/entities/models/country';

export function countryPresenter(countries: Country[]) {
    return countries.map((country) => ({
        id: country.id,
        name: country.name,
    }));
}
