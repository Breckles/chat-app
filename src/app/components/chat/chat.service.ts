import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { AuthService } from '../auth/auth.service';
import {
  ChatMessage,
  CHAT_MESSAGE_CONVERTER,
} from './models/chatMessage.model';
import { Chatroom, CHATROOM_CONVERTER } from './models/chatroom.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatroomBehaviorSubject = new BehaviorSubject<Chatroom | null>(null);
  private currentChatroom: Chatroom | null = null;

  constructor(
    private auth: AuthService,
    private ngFirestore: AngularFirestore,
    private router: Router
  ) {}

  public sendMessage(message: string) {
    const newMessage: ChatMessage = {
      value: message,
      author: this.auth.user!.uid,
    };
    this.currentChatroom?.messagesRef
      ?.add(newMessage)
      .catch((error: firebase.firestore.FirestoreError) => {
        console.log('An error occurred while writing the message: %o', error);
      });
  }

  // This might be a good candidate for a 'transaction' type operation (eg. It
  // all works or it all fails)
  async createChatroom(chatroomName: string) {
    let newChatroomRef: DocumentReference<Chatroom>;

    let newChatroom = new Chatroom(
      chatroomName,
      this.auth.user!.uid,
      `${chatroomName} chatroom created!`,
      [this.auth.user!.uid]
    );

    try {
      newChatroomRef = await this.ngFirestore
        .collection<Chatroom>('chatrooms')
        .ref.withConverter(CHATROOM_CONVERTER)
        .add(newChatroom);
    } catch (error) {
      console.log('An error occurred while creating the chatroom: %o', error);
      return;
    }

    try {
      // create 'messages' collection and add default first message. (.add
      // creates the collection if it doesn't exist)
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
      .collection<Chatroom>('chatrooms')
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
    let chatroomRef = this.ngFirestore
      .collection<Chatroom>('chatrooms')
      .ref.withConverter(CHATROOM_CONVERTER)
      .doc(chatroomID);

    chatroomRef
      .get()
      .then(
        (chatroomSnapshot: firebase.firestore.DocumentSnapshot<Chatroom>) => {
          if (chatroomSnapshot.exists) {
            this.currentChatroom = chatroomSnapshot.data()!;
            this.currentChatroom.ref = new AngularFirestoreDocument<Chatroom>(
              chatroomRef,
              this.ngFirestore
            );

            let messagesRef = this.ngFirestore
              .collection<ChatMessage>(`chatrooms/${chatroomID}/messages`)
              .ref.withConverter(CHAT_MESSAGE_CONVERTER);

            this.currentChatroom.messagesRef = new AngularFirestoreCollection<ChatMessage>(
              messagesRef,
              messagesRef.orderBy('timestamp'),
              this.ngFirestore
            );

            this.chatroomBehaviorSubject.next(this.currentChatroom);
          } else {
            console.log('The chatroom does not exist!');
          }
        }
      )
      .catch((error) => {
        console.log(
          'There was an error getting the chatroom object: %o',
          error
        );
      });

    // this.currentChatroom!.messagesRef;
    // this.currentChatroomMessagesRef = this.currentChatroomRef.collection(
    //   'messages',
    //   (ref: firebase.firestore.CollectionReference) => {
    //     return ref.orderBy('timestamp');
    //   }
    // );
  }
}
