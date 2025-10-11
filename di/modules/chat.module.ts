import { sendChatMessageController } from '@/interface-adapters/controllers/chat.controller';
import { sendChatMessageUseCase } from '@/application/use-cases/send-chat-message.use-case';
import { ChatService } from '@/infrastructure/services/chat.service';
import { createModule } from '@evyweb/ioctopus';
import { getInjection } from '../container';
import { DI_SYMBOLS } from '@/di/types';

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
