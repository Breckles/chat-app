import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  CollectionReference,
  DocumentReference,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { AuthService } from '../auth/auth.service';
import { ChatMessage } from './interfaces/chatMessage.interface';
import { ChatRoom } from './interfaces/chatRoom.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentChatroomRef!: DocumentReference<ChatRoom>;
  currentChatroomMessages!: AngularFirestoreCollection<ChatMessage>;

  constructor(
    private auth: AuthService,
    private ngFirestore: AngularFirestore,
    private router: Router
  ) {}

  // public getChatMessagesObservable(): Observable<ChatMessage[]> {
  //   return this.chatMessagesObservable;
  // }

  public sendMessage(message: string) {
    const newMessage: ChatMessage = {
      value: message,
      author: this.auth.user!.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
  }

  public createChatroom(chatroomName: string) {
    this.ngFirestore
      .collection<ChatRoom>('chatrooms')
      .add({
        name: chatroomName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        lastMessage: `${chatroomName} chatroom created!`,
        members: firebase.firestore.FieldValue.arrayUnion(this.auth.user!.uid),
      })
      .then(
        (chatroomRef: DocumentReference<ChatRoom>) => {
          this.currentChatroomRef = chatroomRef;
          this.currentChatroomMessages = this.ngFirestore
            .collection<ChatRoom>('chatrooms')
            .doc(chatroomRef.id)
            .collection<ChatMessage>('messages');
          this.currentChatroomMessages
            .add({
              value: `${chatroomName} chatroom created!`,
              author: `${this.auth.user!.uid}`,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .catch((error: firebase.firestore.FirestoreError) => {
              console.log(
                'An error occurred while adding a message to chatroomMessages: %o',
                error
              );
            });
          this.router.navigate(['chat', chatroomRef.id]);
        },
        (error: firebase.firestore.FirestoreError) => {
          console.log(
            'An error occurred during chat creation: ' + error.message
          );
        }
      );
  }

  private addMemberToChatroom(chatroomID: string, userID: string) {
    this.ngFirestore
      .collection<ChatRoom>('chatrooms')
      .doc(chatroomID)
      .update({
        members: firebase.firestore.FieldValue.arrayUnion(this.auth.user!.uid),
      })
      .catch((error: firebase.firestore.FirestoreError) => {
        console.log(
          'An error occurred during chatroomMembers creation: ' + error.message
        );
      });
  }
}
