import { ICreateCountryController } from '@/src/interface-adapters/controllers/create-country.controller';
import { ICreateCountryUseCase } from '@/src/application/use-cases/create-country.use-case';
import { ICountriesRepository } from '@/src/application/repositories/countries.repository.interface';

export const DI_SYMBOLS = {
    ICountryRepository: Symbol.for('ICountryRepository'),
    ICreateCountryUseCase: Symbol.for('ICreateCountryUseCase'),
    ICreateCountryController: Symbol.for('ICreateCountryController'),
};

export interface Registry {
    [DI_SYMBOLS.ICountryRepository]: ICountriesRepository;
    [DI_SYMBOLS.ICreateCountryController]: ICreateCountryController;
    [DI_SYMBOLS.ICreateCountryUseCase]: ICreateCountryUseCase;
}
