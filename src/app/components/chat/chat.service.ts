import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { AuthService } from '../auth/auth.service';
import { ChatMessage } from './interfaces/chatMessage.interface';
import { ChatRoom } from './interfaces/chatRoom.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentChatroomRef: AngularFirestoreDocument<ChatRoom> | null = null;
  currentChatroomMessagesRef: AngularFirestoreCollection<ChatMessage> | null = null;

  constructor(
    private auth: AuthService,
    private ngFirestore: AngularFirestore,
    private router: Router
  ) {}

  public getChatMessagesObservable(): Observable<ChatMessage[]> | null {
    if (this.currentChatroomMessagesRef) {
      return this.currentChatroomMessagesRef.valueChanges();
    } else {
      return null;
    }
  }

  public sendMessage(message: string) {
    const newMessage: ChatMessage = {
      value: message,
      author: this.auth.user!.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    this.currentChatroomMessagesRef!.add(newMessage).catch(
      (error: firebase.firestore.FirestoreError) => {
        console.log('An error occurred while writing the message: %o', error);
      }
    );
  }

  // This might be a good candidate for a 'transaction' type operation (eg. It
  // all works or it all fails)
  async createChatroom(chatroomName: string) {
    let newChatroomRef: DocumentReference<ChatRoom>;
    try {
      newChatroomRef = await this.ngFirestore
        .collection<ChatRoom>('chatrooms')
        .add({
          name: chatroomName,
          createdBy: this.auth.user!.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          lastMessage: `${chatroomName} chatroom created!`,
        });
    } catch (error) {
      console.log('An error occurred while creating the chatroom: %o', error);
      return;
    }

    try {
      await newChatroomRef.collection('messages').add({
        value: `${chatroomName} chatroom created!`,
        author: 'admin',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.log(
        'An error occurred while creating chatroom messages: %o',
        error
      );
      return;
    }

    this.addChatroomToMember(newChatroomRef.id, this.auth.user!.uid);

    this.router.navigate(['chat'], {
      queryParams: { chatroomID: newChatroomRef.id },
    });
  }

  private addMemberToChatroom(chatroomID: string, userID: string) {
    this.ngFirestore
      .collection<ChatRoom>('chatrooms')
      .doc(chatroomID)
      .update({
        members: firebase.firestore.FieldValue.arrayUnion(userID),
      })
      .catch((error: firebase.firestore.FirestoreError) => {
        console.log(
          'An error occurred during chatroomMembers creation: ' + error.message
        );
      });
  }

  private addChatroomToMember(chatroomID: string, userID: string) {
    this.ngFirestore
      .collection('users')
      .doc(userID)
      .update({
        chatrooms: firebase.firestore.FieldValue.arrayUnion(chatroomID),
      })
      .catch((error: firebase.firestore.FirestoreError) => {
        console.log(
          'There was an error while adding the chatroom to the user: %o',
          error
        );
      });
  }

  async setChatroom(chatroomID: string) {
    this.currentChatroomRef = this.ngFirestore
      .collection<ChatRoom>('chatrooms')
      .doc(chatroomID);

    this.currentChatroomMessagesRef = this.currentChatroomRef.collection(
      'messages',
      (ref: firebase.firestore.CollectionReference) => {
        return ref.orderBy('timestamp');
      }
    );
  }
}
