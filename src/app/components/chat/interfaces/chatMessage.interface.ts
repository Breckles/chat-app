import { FieldValue } from '@firebase/firestore-types';
import firebase from 'firebase/app';

export interface ChatMessage {
  value: string;
  author: string;

  /** When creating a chatmessage, a placeholder value is assigned to
   * timestamp. This will cause firebase to inject a date string during the
   * write operation. When the record is retrieved, timestamp will be a string */
  timestamp: firebase.firestore.FieldValue | string;
}
