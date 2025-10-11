import { sendChatMessageController } from '@/interface-adapters/controllers/chat.controller';
import { sendChatMessageUseCase } from '@/application/use-cases/send-chat-message.use-case';
import { ChatService } from '@/infrastructure/services/chat.service';
import { createModule } from '@evyweb/ioctopus';
import { getInjection } from '../container';
import { DI_SYMBOLS } from '@/di/types';

/**
 * Initializes and wires together all dependencies required for the chat feature.
 *
 * This module configures and registers the following components within the IoC container:
 * - **ChatService**: Handles interaction with the OpenAI API.
 * - **SendChatMessageUseCase**: Contains the application logic for sending messages and managing user-specific conversation state.
 * - **SendChatMessageController**: Acts as the entry point for handling chat message requests, performing authentication and input validation.
 *
 * Each dependency is bound to a unique DI symbol so that it can be injected into other modules or components
 * without requiring manual instantiation.
 *
 * The use of `toValue` ensures that these bindings are singletons within the container,
 * meaning each component is instantiated once and shared across the application lifecycle.
 *
 * @returns {Module} A configured IoC module containing all chat-related bindings.
 */
export const chatModule = () => {
    const chatModule = createModule();

    // Create instances and wire dependencies
    const chatService = new ChatService();
    const useCase = sendChatMessageUseCase(chatService);
    const authService = getInjection('IAuthenticationService');
    const controller = sendChatMessageController(authService, useCase);

    // bind to IoC container
    chatModule.bind(DI_SYMBOLS.IChatService).toValue(chatService);
    chatModule.bind(DI_SYMBOLS.ISendChatMessageUseCase).toValue(useCase);
    chatModule.bind(DI_SYMBOLS.ISendChatMessageController).toValue(controller);

    return chatModule;
};
