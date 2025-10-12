import {
    ConversationMessage,
    ISendChatMessageUseCase,
} from '@/application/use-cases/send-chat-message.use-case';
import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { UnauthenticatedError } from '@/entities/errors/auth';

/**
 * The type alias representing the structure of the SendChatMessageController factory.
 * It infers the return type of the `sendChatMessageController` function, ensuring
 * proper type safety and compatibility across dependency injection layers.
 */
export type ISendChatMessageController = ReturnType<
    typeof sendChatMessageController
>;

/**
 * Factory function that creates a controller responsible for handling chat message requests.
 *
 * This controller acts as the bridge between the presentation layer (e.g., Next.js route handlers)
 * and the application layer (use case logic), enforcing authentication and input integrity.
 *
 * @param {IAuthenticationService} authService - Service responsible for verifying authentication status and retrieving the current user ID.
 * @param {ISendChatMessageUseCase} sendChatUseCase - Use case that handles the logic of sending a message and retrieving a chat response.
 * @returns {Function} An asynchronous controller function that takes a message string and returns the AI’s response.
 *
 * @throws {UnauthenticatedError} If the user is not logged in.
 * @throws {Error} If the input message is invalid or exceeds the maximum allowed length.
 */
export const sendChatMessageController = (
    authService: IAuthenticationService,
    sendChatUseCase: ISendChatMessageUseCase,
) => {
    return async (message: string): Promise<ConversationMessage> => {
        const isAuthenticated = await authService.isAuthenticated();
        if (!isAuthenticated) {
            throw new UnauthenticatedError('User must be logged in.');
        }
        const userId = await authService.getCurrentUserId();

        if (userId === null) {
            throw new UnauthenticatedError('Unable to retrieve user ID.');
        }

        // Input validation
        if (typeof message !== 'string' || message.trim().length === 0) {
            const error: ConversationMessage = {
                success: false,
                role: 'assistant',
                content: 'The message is not valid',
            };
            return error;
        }
        if (message.length > 2000) {
            const error: ConversationMessage = {
                success: false,
                role: 'assistant',
                content: 'Message exceeds maximum length of 2000 characters',
            };
            return error;
        }
        return sendChatUseCase(userId, message);
    };
};
