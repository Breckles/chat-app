import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ChatMessage } from './interfaces/chatMessage.interface';

import * as firebase from 'firebase/app';
import 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatMessagesRef: AngularFireList<ChatMessage>;
  chatMessagesObservable: Observable<ChatMessage[]>;

  constructor(private auth: AuthService, private fireDB: AngularFireDatabase) {
    this.chatMessagesRef = this.fireDB.list('messages');
    this.chatMessagesObservable = this.chatMessagesRef.valueChanges();
  }

  public getChatMessagesObservable(): Observable<ChatMessage[]> {
    return this.chatMessagesObservable;
  }

  public sendMessage(message: string) {
    const newMessage: ChatMessage = {
      value: message,
      author: this.auth.user!.uid,
      timeStamp: firebase.default.database.ServerValue.TIMESTAMP,
    };
    this.chatMessagesRef.push(newMessage);
  }
}
