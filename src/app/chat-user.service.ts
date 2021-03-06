import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import firebase from 'firebase/app';

import { AuthService } from './components/auth/auth.service';
import { ChatUser, CHAT_USER_CONVERTER } from './models/chat-user.model';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {
  UserChatrooms,
  USER_CHATROOMS_CONVERTER,
} from './components/chat/models/userChatrooms.model';

@Injectable({
  providedIn: 'root',
})
export class ChatUserService {
  private _chatUser = new BehaviorSubject<ChatUser | null>(null);
  private _chatUserChatroomsBehaviorSubject = new BehaviorSubject<Observable<
    UserChatrooms | undefined
  > | null>(null);

  private _chatUserChatroomsObservable!: Observable<UserChatrooms | undefined>;

  constructor(
    private auth: AuthService,
    private ngFirestore: AngularFirestore
  ) {
    this.auth.authUser.subscribe((authUser: firebase.User | null) => {
      if (authUser) {
        this.fetchAndSetChatUser(authUser.uid);
      } else {
        this._chatUser.next(null);
      }
    });
  }

  private fetchAndSetChatUser(id: string) {
    this.ngFirestore
      .collection<ChatUser>('chatUsers')
      .ref.withConverter(CHAT_USER_CONVERTER)
      .doc(id)
      .get()
      .then((snapshot: firebase.firestore.DocumentSnapshot<ChatUser>) => {
        if (snapshot.exists) {
          const chatUser = snapshot.data() as ChatUser;
          this._chatUser.next(chatUser);
          this.fetchAndSetChatUserChatrooms(id);
        }
      })
      .catch((error: firebase.FirebaseError) => {
        console.log(
          'An error occurred while fetching the chatUser record: %o',
          error
        );
      });
  }

  private fetchAndSetChatUserChatrooms(id: string) {
    this.ngFirestore
      .collection<UserChatrooms>('userChatrooms')
      .ref.withConverter(USER_CHATROOMS_CONVERTER)
      .doc(id)
      .get()
      .then((snapshot: firebase.firestore.DocumentSnapshot<UserChatrooms>) => {
        if (snapshot.exists) {
          const userChatrooms = snapshot.data() as UserChatrooms;
          this._chatUserChatroomsObservable = this.ngFirestore
            .collection<UserChatrooms>('userChatrooms')
            .doc(id)
            .valueChanges();
          this._chatUserChatroomsBehaviorSubject.next(
            this._chatUserChatroomsObservable
          );
        }
      })
      .catch((error: firebase.FirebaseError) => {
        console.log(
          'An error occurred while fetching userChatrooms info: %o',
          error
        );
      });
  }

  public addChatroom(chatroomID: string, chatroomName: string, userID: string) {
    this.ngFirestore
      .collection<UserChatrooms>('userChatrooms')
      .doc(userID)
      .ref.withConverter(USER_CHATROOMS_CONVERTER)
      .update({
        chatrooms: firebase.firestore.FieldValue.arrayUnion({
          id: chatroomID,
          name: chatroomName,
        }),
      })
      .catch((error: firebase.FirebaseError) => {
        console.log(
          'There was an error while adding the chatroom to the user: %o',
          error
        );
      });
  }

  public get chatUser() {
    return this._chatUser;
  }

  public get chatUserChatrooms() {
    return this._chatUserChatroomsBehaviorSubject;
  }
}
