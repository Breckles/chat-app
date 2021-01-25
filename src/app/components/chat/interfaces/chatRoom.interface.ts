import { FieldValue } from '@firebase/firestore-types';

import { ChatMessage } from './chatMessage.interface';

export interface ChatRoom {
  name: string;
  createdBy: string;
  lastMessage: string;
  messages?: ChatMessage[];
  members?: FieldValue | string[];

  /** When creating a chatroom, a placeholder value is assigned to
   * timestamp. This will cause firebase to inject a date string during the
   * write operation. When the record is retrieved, timestamp will be a string */
  timestamp: FieldValue | string;
}
