import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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
  private _authenticationState = new BehaviorSubject<boolean>(false);
  authErrorSubject = new Subject<string>();

  constructor(
    private afAuth: AngularFireAuth,
    private ngFirestore: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.onAuthStateChanged;
    this.afAuth.user.subscribe((user: firebase.User | null) => {
      if (user === null) {
        this.logout();
      } else {
        this.authenticationState.next(true);
      }
    });
  }

  async login(email: string, password: string) {
    // Authenticate the user
    let userCredential: firebase.auth.UserCredential | undefined;
    try {
      userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
    } catch (error) {
      console.log('An error occured while logging in: %o', error);
    }

    if (userCredential?.user) {
      // successful login
      this._authenticationState.next(true);

      // Fetch chatUser record from database
      try {
        let chatUserSnapshot = await this.ngFirestore
          .collection<ChatUser>('chatUsers')
          .ref.withConverter(CHAT_USER_CONVERTER)
          .doc(userCredential.user.uid)
          .get();

        if (chatUserSnapshot.exists) {
          this.chatUser = chatUserSnapshot.data()!;
          this.router.navigate(['home']);
        }
      } catch (error) {
        console.log(
          'An error occurred while fetching the chatUser record: %o',
          error
        );
      }
    }
  }

  signUp(email: string, password: string) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential: firebase.auth.UserCredential) => {
        // successful signup
        if (userCredential.user) {
          this.chatUser = this.createNewChatUser(userCredential.user);
          this.router.navigate(['home']);
        }
      })
      .catch((error: AuthError) => {
        // error during signup
        this.handleError(error);
      });
  }

  logout() {
    this.afAuth.signOut();
    this._authenticationState.next(false);
    this.router.navigate(['home']);
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
