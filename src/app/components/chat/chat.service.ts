import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ChatMessage } from './interfaces/chatMessage.interface';

import firebase from 'firebase/app';
import 'firebase/database';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentChatroomID!: string;
  chatMessagesRef: AngularFireList<ChatMessage>;
  chatMessagesObservable: Observable<ChatMessage[]>;

  constructor(
    private auth: AuthService,
    private fireDB: AngularFireDatabase,
    private router: Router
  ) {
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
      timeStamp: firebase.database.ServerValue.TIMESTAMP,
    };
    this.chatMessagesRef
      .push(newMessage)
      .catch((error: firebase.FirebaseError) => {
        console.log(
          'There was an error sending the chat message: ' + error.message
        );
      });
  }

  public createChatroom(chatroomName: string) {
    this.fireDB.database
      .ref('chatrooms')
      .push({
        name: chatroomName,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        lastMessage: `${chatroomName} chatroom created!`,
      })
      .then(
        (chatroomRef: firebase.database.Reference) => {
          this.createChatroomMembers(chatroomRef.key!, this.auth.user?.uid!);
          this.router.navigate(['chat', chatroomRef.key]);
        },
        (error: firebase.FirebaseError) => {
          console.log(
            'An error occurred during chat creation: ' + error.message
          );
        }
      );
  }

  /** Create a chatroomMembers entry in the database and add the creator of the
   * chatroom as a member. The key for the entry is the id of the chatroom. Will
   * eventually move the creation of a chatroomMembers entry to a cloud function
   * so it can be performed server side automatically when a chatroom is created
   */
  private createChatroomMembers(chatroomID: string, userID: string) {
    this.fireDB.database
      .ref(`chatroomMembers/${chatroomID}/${userID}`)
      .set(true)
      .catch((error: firebase.FirebaseError) => {
        console.log(
          'An error occurred during chatroomMembers creation: ' + error.message
        );
      });
  }
}
