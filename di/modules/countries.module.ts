import { createCountryUseCase } from "@/src/application/use-cases/create-country.use-case";
import { CountriesRepositoryMock } from "@/src/infrastructure/countries.repository.mock";
import { createCountryController } from "@/src/interface-adapters/controllers/create-country.controller";
import { createModule } from "@evyweb/ioctopus";
import { DI_SYMBOLS } from "../types";

export function countriesModule() {
    const countriesModule = createModule();
    countriesModule
        .bind(DI_SYMBOLS.ICountryRepository)
        .toClass(CountriesRepositoryMock);
    countriesModule
        .bind(DI_SYMBOLS.ICreateCountryController)
        .toHigherOrderFunction(createCountryController, [
            DI_SYMBOLS.ICreateCountryUseCase,
        ]);
    countriesModule
        .bind(DI_SYMBOLS.ICreateCountryUseCase)
        .toHigherOrderFunction(createCountryUseCase, [
            DI_SYMBOLS.ICountryRepository,
        ]);
    return countriesModule;
}