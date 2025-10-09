import { sendChatMessageUseCase } from '@/application/use-cases/send-chat-message.use-case';
import { IAuthenticationService } from '@/application/services/auth.service.interface';

export type ISendChatMessageController = ReturnType<
    typeof sendChatMessageController
>;

export const sendChatMessageController = (
    authService: IAuthenticationService,
) => {
    const sendChat = sendChatMessageUseCase();

    return async (message: string): Promise<string> => {
        if (!authService.isAuthenticated()) {
            throw new Error('User not authenticated');
        }
        // Input validation
        if (typeof message !== 'string' || message.trim().length === 0) {
            throw new Error('Invalid message');
        }
        if (message.length > 1000) {
            throw new Error(
                'Message exceeds maximum length of 1000 characters',
            );
        }

        return sendChat(message);
    };
};
