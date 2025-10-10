import { MockSolvesRepository } from '@/infrastructure/repositories/solves.repository.mock';
import { SolvesRepository } from '@/infrastructure/repositories/solves.repository';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

export function solvesModule() {
    const solvesModule = createModule();

    if (process.env.NODE_ENV === 'test') {
        solvesModule
            .bind(DI_SYMBOLS.ISolvesRepository)
            .toClass(MockSolvesRepository);
    } else {
        solvesModule
            .bind(DI_SYMBOLS.ISolvesRepository)
            .toClass(SolvesRepository);
    }

    return solvesModule;
}
