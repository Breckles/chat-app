import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { ChatMessage } from './interfaces/chatMessage.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private fireDb: AngularFireDatabase) {}

  public getChatRoom(): Observable<ChatMessage[]> {
    return this.fireDb.list('chatRoom').valueChanges() as Observable<
      ChatMessage[]
    >;
  }
}
