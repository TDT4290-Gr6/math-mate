import { sendChatMessageController } from '@/interface-adapters/controllers/chat.controller';
import { sendChatMessageUseCase } from '@/application/use-cases/send-chat-message.use-case';
import { IAuthenticationService } from '@/application/services/auth.service.interface';
import { ChatService } from '@/infrastructure/services/chat.service';
import { createModule } from '@evyweb/ioctopus';
import { container } from '@/di/container';
import { DI_SYMBOLS } from '@/di/types';

export const chatModule = () => {
    const module = createModule();

    const chatService = new ChatService();
    const useCase = sendChatMessageUseCase(chatService);
    const authService = container.get<IAuthenticationService>(
        DI_SYMBOLS.IAuthenticationService,
    );
    const controller = sendChatMessageController(authService, useCase);

    // bind to IoC container
    module.bind(DI_SYMBOLS.IChatService).toValue(chatService);
    module.bind(DI_SYMBOLS.ISendChatMessageUseCase).toValue(useCase);
    module.bind(DI_SYMBOLS.ISendChatMessageController).toValue(controller);

    return module;
};
