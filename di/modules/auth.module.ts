import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

export function authModule() {
    const authModule = createModule();

    if (process.env.NODE_ENV === 'test') {
        authModule
            .bind(DI_SYMBOLS.IAuthenticationService)
            .toClass(MockAuthenticationService);
    } else {
        throw new Error('No real authentication service implemented yet.');
    }

    return authModule;
}
