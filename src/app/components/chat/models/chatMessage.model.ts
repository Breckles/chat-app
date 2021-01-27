import { FieldValue } from '@firebase/firestore-types';
import firebase from 'firebase/app';

export class ChatMessage {
  constructor(
    public value: string,
    public author: string,
    public timestamp?: firebase.firestore.Timestamp
  ) {}
}

export const CHAT_MESSAGE_CONVERTER: firebase.firestore.FirestoreDataConverter<ChatMessage> = {
  toFirestore(chatMessage: ChatMessage) {
    return {
      value: chatMessage.value,
      author: chatMessage.author,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): ChatMessage {
    const data = snapshot.data(options);
    return new ChatMessage(data.value, data.author, data.timestamp);
  },
};
