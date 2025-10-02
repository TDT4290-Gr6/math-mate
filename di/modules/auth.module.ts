import { MockAuthenticationService } from '@/infrastructure/services/auth.service.mock';
import { AuthenticationService } from '@/infrastructure/services/auth.service';
import { createModule } from '@evyweb/ioctopus';
import { DI_SYMBOLS } from '../types';

export function authModule() {
    const authModule = createModule();

    if (process.env.NODE_ENV === 'test') {
        authModule
            .bind(DI_SYMBOLS.IAuthenticationService)
            .toClass(MockAuthenticationService);
    } else {
        authModule
            .bind(DI_SYMBOLS.IAuthenticationService)
            .toClass(AuthenticationService);
    }

    return authModule;
}
