'use server';

import { container } from '@/di/container';
import { DI_SYMBOLS } from '@/di/types';
import { ISendChatMessageController } from '@/interface-adapters/controllers/chat.controller';


export async function sendMessageAction(message: string): Promise<string> {
  try {

    const chatController = container.get<ISendChatMessageController>(
      DI_SYMBOLS.ISendChatMessageController
    );

    const reply = await chatController(message);
    return reply;
  } catch (err: any) {
    console.error('Failed to send message', err);
    throw new Error('Failed to get chatbot response.');
  }
}