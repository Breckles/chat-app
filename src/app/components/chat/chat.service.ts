import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference,
} from '@angular/fire/firestore';
import firebase from 'firebase/app';

import {
  ChatMessage,
  CHAT_MESSAGE_CONVERTER,
} from './models/chatMessage.model';
import { Chatroom, CHATROOM_CONVERTER } from './models/chatroom.model';
import { ChatUserService } from 'src/app/chat-user.service';
import { ChatUser } from 'src/app/models/chat-user.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private chatUser: ChatUser | null = null;
  private _currentChatroom: Chatroom | null = null;
  private _currentChatroomBehaviorSubject = new BehaviorSubject<Chatroom | null>(
    null
  );

  constructor(
    private chatUserService: ChatUserService,
    private ngFirestore: AngularFirestore,
    private router: Router
  ) {
    this.chatUserService.chatUser.subscribe((chatUser: ChatUser | null) => {
      this.chatUser = chatUser;
    });
  }

  public sendMessage(message: string) {
    if (this.chatUser && this._currentChatroom) {
      this._currentChatroom.addMessage(message, this.chatUser);
    }
  }

  // This might be a good candidate for a 'transaction' type operation (eg. It
  // all works or it all fails)
  async createChatroom(chatroomName: string) {
    if (this.chatUser) {
      let newChatroomRef: DocumentReference<Chatroom>;

      try {
        newChatroomRef = await this.ngFirestore
          .collection<Chatroom>('chatrooms')
          .ref.withConverter(CHATROOM_CONVERTER)
          .doc();

        let newChatroom = new Chatroom(
          newChatroomRef.id,
          chatroomName,
          this.chatUser.uid,
          `${chatroomName} chatroom created!`,
          [this.chatUser.uid]
        );

        newChatroomRef.set(newChatroom);
      } catch (error) {
        console.log('An error occurred while creating the chatroom: %o', error);
        return;
      }

      try {
        // create 'messages' collection and add default first message. (.add
        // creates the collection if it doesn't exist)
        await newChatroomRef
          .collection('messages')
          .withConverter(CHAT_MESSAGE_CONVERTER)
          .add(
            new ChatMessage(
              `${chatroomName} chatroom created!`,
              new ChatUser('', null, null, 'Chat Creator Bot')
            )
          );
      } catch (error) {
        console.log(
          'An error occurred while creating chatroom messages: %o',
          error
        );
        return;
      }
      this.chatUserService.addChatroom(
        newChatroomRef.id,
        chatroomName,
        this.chatUser.uid
      );

      this.router.navigate(['chat'], {
        queryParams: { chatroomID: newChatroomRef.id },
      });
    }
  }

  private addMember(chatroomID: string, userID: string) {
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
            this._currentChatroom = chatroomSnapshot.data() as Chatroom;
            this._currentChatroom.ref = new AngularFirestoreDocument<Chatroom>(
              chatroomRef,
              this.ngFirestore
            );

            let messagesRef = this.ngFirestore
              .collection<ChatMessage>(`chatrooms/${chatroomID}/messages`)
              .ref.withConverter(CHAT_MESSAGE_CONVERTER);

            this._currentChatroom.setMessagesRef(
              new AngularFirestoreCollection<ChatMessage>(
                messagesRef,
                messagesRef.orderBy('timestamp'),
                this.ngFirestore
              )
            );

            this._currentChatroomBehaviorSubject.next(this._currentChatroom);
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
  }

  public get currentChatroom() {
    return this._currentChatroomBehaviorSubject;
  }
}
