import firebase from 'firebase/app';
import { ChatroomInfo } from '../../chat/models/chatroom.model';

export class ChatUser {
  constructor(
    public uid: string,
    public email: string | null,
    public photoURL: string | null,
    public displayName: string | null,
    public chatrooms: firebase.firestore.FieldValue | ChatroomInfo[]
  ) {}
}

export const CHAT_USER_CONVERTER: firebase.firestore.FirestoreDataConverter<ChatUser> = {
  toFirestore(chatUser: ChatUser) {
    return {
      email: chatUser.email,
      photoURL: chatUser.photoURL,
      displayName: chatUser.displayName,
      chatrooms: chatUser.chatrooms,
    };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): ChatUser {
    const data = snapshot.data(options);
    return new ChatUser(
      snapshot.id,
      data.email,
      data.photoURL,
      data.displayName,
      data.chatrooms
    );
  },
};
