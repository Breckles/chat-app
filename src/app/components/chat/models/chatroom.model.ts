import { Observable } from 'rxjs';

import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { ChatMessage } from './chatMessage.model';

export class Chatroom {
  constructor(
    public name: string,
    public createdBy: string,
    public lastMessage: string,
    public members: string[] | firebase.firestore.FieldValue,
    public timestamp?: firebase.firestore.Timestamp,
    public ref?: AngularFirestoreDocument<Chatroom>,
    public messagesRef?: AngularFirestoreCollection<ChatMessage>
  ) {}

  getMessagesObservable(): Observable<ChatMessage[]> | null {
    if (this.messagesRef) {
      return this.messagesRef.valueChanges();
    }
    return null;
  }
}

export interface ChatroomInfo {
  id: string;
  name: string;
}

export const CHATROOM_CONVERTER: firebase.firestore.FirestoreDataConverter<Chatroom> = {
  toFirestore(chatroom: Chatroom): firebase.firestore.DocumentData {
    return {
      name: chatroom.name,
      createdBy: chatroom.createdBy,
      lastMessage: chatroom.lastMessage,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      members: chatroom.members,
    };
  },

  fromFirestore(
    snapshot: firebase.firestore.QueryDocumentSnapshot,
    options: firebase.firestore.SnapshotOptions
  ): Chatroom {
    const data = snapshot.data(options);
    return new Chatroom(
      data.name,
      data.createdBy,
      data.lastMessage,
      data.timestamp,
      data.members
    );
  },
};
