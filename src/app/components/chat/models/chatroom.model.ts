import { Observable } from 'rxjs';

import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { ChatMessage } from './chatMessage.model';

export class Chatroom {
  constructor(
    public id: string,
    public name: string,
    public createdBy: string,
    public lastMessage: string,
    public members: string[] | firebase.firestore.FieldValue,
    public timestamp?: firebase.firestore.Timestamp,
    public ref?: AngularFirestoreDocument<Chatroom>,
    private _messages: AngularFirestoreCollection<ChatMessage> | null = null
  ) {}

  public getMessages(): Observable<ChatMessage[]> | null {
    if (this._messages) {
      return this._messages.valueChanges();
    }
    return null;
  }

  public setMessages(messages: AngularFirestoreCollection<ChatMessage>) {
    this._messages = messages;
  }

  public addMessage(message: string, userID: string) {
    if (this._messages) {
      const newMessage = new ChatMessage(message, userID);
      this._messages.add(newMessage);
    }
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
      snapshot.id,
      data.name,
      data.createdBy,
      data.lastMessage,
      data.members,
      data.timestamp
    );
  },
};
