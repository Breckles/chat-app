import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { ChatMessage, CHAT_MESSAGE_CONVERTER } from './chatMessage.model';
import { ChatUser } from 'src/app/models/chat-user.model';

export class Chatroom {
  constructor(
    public id: string,
    public name: string,
    public createdBy: string,
    public lastMessage: string,
    public members: string[] | firebase.firestore.FieldValue,
    public timestamp?: firebase.firestore.Timestamp,
    public ref?: AngularFirestoreDocument<Chatroom>,
    private _messagesRef: AngularFirestoreCollection<ChatMessage> | null = null
  ) {}

  /**
   * Returns an observable of the chat messages for this classroom. On first
   * invocation, all existing messages will be included. Afterwards, only the
   * newly added messages will be included
   */
  public getMessages(): Observable<ChatMessage[]> | null {
    if (this._messagesRef) {
      this._messagesRef.get().toPromise().then;
      return this._messagesRef.stateChanges().pipe(
        map((actions: DocumentChangeAction<ChatMessage>[]) => {
          const newMessages: ChatMessage[] = [];
          for (const action of actions) {
            // events are emitted immediately on local writes, so this will
            // trigger at a time when a message has been added but not been
            // assigned a server timestamp yet (in which case it will have
            // pending writes). We don't care about these and only want the
            // messages that have been written to the backend and have a server
            // timestamp defined
            if (!action.payload.doc.metadata.hasPendingWrites) {
              newMessages.push(action.payload.doc.data());
            }
          }
          return newMessages;
        })
      );
    }
    return null;
  }

  public setMessagesRef(messagesRef: AngularFirestoreCollection<ChatMessage>) {
    this._messagesRef = messagesRef;
  }

  public addMessage(message: string, user: ChatUser) {
    if (this._messagesRef) {
      const newMessage = new ChatMessage(message, user);
      this._messagesRef.add(newMessage);
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
