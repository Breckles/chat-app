import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { ChatUser, CHAT_USER_CONVERTER } from './models/chat-user.model';

interface AuthError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public chatUser: ChatUser | null = null;
  public chatUserBehaviorSubject = new BehaviorSubject<ChatUser | null>(null);
  private _authenticationState = new BehaviorSubject<boolean>(false);
  authErrorSubject = new Subject<string>();

  constructor(
    private afAuth: AngularFireAuth,
    private ngFirestore: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.afAuth.onAuthStateChanged;
    this.afAuth.user.subscribe((user: firebase.User | null) => {
      if (user === null) {
        this._authenticationState.next(false);
        this.chatUser = null;
        this.chatUserBehaviorSubject.next(this.chatUser);
        this.router.navigate(['auth']);
      } else {
        this.authenticationState.next(true);
        this.setChatUser(user.uid);
      }
    });
  }

  async login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((_userCredential) => {
        this.authenticationState.next(true);
        this.router.navigate(['']);
      })
      .catch((error) => {
        console.log('An error occured while logging in: %o', error);
        this.handleError(error);
      });
  }

  private setChatUser(userID: string) {
    let chatUser: ChatUser;
    // Fetch chatUser record from database
    this.ngFirestore
      .collection<ChatUser>('chatUsers')
      .ref.withConverter(CHAT_USER_CONVERTER)
      .doc(userID)
      .get()
      .then(
        (chatUserSnapshot: firebase.firestore.DocumentSnapshot<ChatUser>) => {
          if (chatUserSnapshot.exists) {
            this.chatUser = chatUserSnapshot.data()!;
            this.chatUserBehaviorSubject.next(this.chatUser);
          }
        }
      )
      .catch((error) => {
        console.log(
          'An error occurred while fetching the chatUser record: %o',
          error
        );
      });
  }

  signUp(email: string, password: string) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential: firebase.auth.UserCredential) => {
        // successful signup
        if (userCredential.user) {
          this.chatUser = this.createNewChatUser(userCredential.user);
          this.router.navigate(['']);
        }
      })
      .catch((error: AuthError) => {
        // error during signup
        this.handleError(error);
      });
  }

  logout() {
    this.afAuth.signOut();
  }

  private handleError(error: AuthError) {
    let errorMessage = 'An unknown error has occurred';
    console.log(error);
    if (error.message) {
      errorMessage = error.message;
    }
    this.authErrorSubject.next(errorMessage);
  }

  // eventually want to move this to the backend with some cloud functions
  private createNewChatUser(user: firebase.User): ChatUser {
    const newChatUser = new ChatUser(
      user.uid,
      user.email,
      user.photoURL,
      user.displayName,
      []
    );
    this.ngFirestore
      .collection<ChatUser>('chatUsers')
      .ref.withConverter(CHAT_USER_CONVERTER)
      .doc(user.uid)
      .set(newChatUser)
      .catch((error: firebase.firestore.FirestoreError) => {
        console.log(
          'Error occurred while creating user in the database: %o',
          error
        );
        return;
      });

    return newChatUser;
  }

  public get authenticationState() {
    return this._authenticationState;
  }
}
