import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { ChatMessage } from './interfaces/chatMessage.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatMessagesRef: AngularFireList<ChatMessage>;
  chatMessagesObservable: Observable<ChatMessage[]>;

  constructor(private fireDb: AngularFireDatabase) {
    this.chatMessagesRef = this.fireDb.list('chatRoom');
    this.chatMessagesObservable = this.chatMessagesRef.valueChanges();
  }

  public getChatMessagesObservable(): Observable<ChatMessage[]> {
    return this.chatMessagesObservable;
  }

  public sendMessage(message: ChatMessage) {
    this.chatMessagesRef.push(message);
  }
}
