import { ISendChatMessageUseCase } from '@/application/use-cases/send-chat-message.use-case';
import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { UnauthenticatedError } from '@/entities/errors/auth';

export type ISendChatMessageController = ReturnType<
    typeof sendChatMessageController
>;

export const sendChatMessageController = (
    authService: IAuthenticationService,
    sendChatUseCase: ISendChatMessageUseCase,
) => {
    return async (message: string): Promise<string> => {
        const isAuthenticated = await authService.isAuthenticated();
        if (!isAuthenticated) {
            throw new UnauthenticatedError('User must be logged in.');
        }
        // Input validation
        if (typeof message !== 'string' || message.trim().length === 0) {
            throw new Error('The message is not valid');
        }
        if (message.length > 1000) {
            throw new Error(
                'Message exceeds maximum length of 1000 characters',
            );
        }

        return sendChatUseCase(message);
    };
};
