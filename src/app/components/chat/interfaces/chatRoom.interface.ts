import { ChatMessage } from './chatMessage.interface';

export interface ChatRoom {
  messages: ChatMessage[];
  id?: string;
}
