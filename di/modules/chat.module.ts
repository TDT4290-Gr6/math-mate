import { sendChatMessageController } from '@/interface-adapters/controllers/chat.controller';
import { sendChatMessageUseCase } from '@/application/use-cases/send-chat-message.use-case';
import { MockChatService } from '@/infrastructure/services/chat.service.mock';
import { ChatService } from '@/infrastructure/services/chat.service';
import { createModule } from '@evyweb/ioctopus';
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
 * The use of `toClass` and `toHigherOrderFunction` ensures that these bindings follow the container's
 * configured lifecycle, with services typically instantiated once and shared across the application.
 *
 * @returns {Module} A configured IoC module containing all chat-related bindings.
 */
export const chatModule = () => {
    const chatModule = createModule();

    // Bind ChatService
    if (process.env.NODE_ENV === 'test') {
        chatModule.bind(DI_SYMBOLS.IChatService).toClass(MockChatService);
    } else {
        chatModule.bind(DI_SYMBOLS.IChatService).toClass(ChatService);
    }

    // Bind UseCase with DI
    chatModule
        .bind(DI_SYMBOLS.ISendChatMessageUseCase)
        .toHigherOrderFunction(sendChatMessageUseCase, [
            DI_SYMBOLS.IChatService,
        ]);

    // Bind Controller with DI
    chatModule
        .bind(DI_SYMBOLS.ISendChatMessageController)
        .toHigherOrderFunction(sendChatMessageController, [
            DI_SYMBOLS.IAuthenticationService,
            DI_SYMBOLS.ISendChatMessageUseCase,
        ]);

    return chatModule;
};
