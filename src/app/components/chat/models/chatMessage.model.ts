import firebase from 'firebase/app';

import { ChatUser } from 'src/app/models/chat-user.model';

export class ChatMessage {
  constructor(
    public value: string,
    public author: ChatUser,
    public timestamp?: firebase.firestore.Timestamp
  ) {}
}

export const CHAT_MESSAGE_CONVERTER: firebase.firestore.FirestoreDataConverter<ChatMessage> = {
  toFirestore(chatMessage: ChatMessage) {
    return {
      value: chatMessage.value,
      author: {
        uid: chatMessage.author.uid,
        email: chatMessage.author.email,
        photoURL: chatMessage.author.photoURL,
        displayName: chatMessage.author.displayName,
      },
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
