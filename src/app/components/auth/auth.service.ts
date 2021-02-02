import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

import { ChatUser, CHAT_USER_CONVERTER } from '../../models/chat-user.model';
import { UserChatrooms } from '../chat/models/userChatrooms.model';

interface AuthError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authUser = new BehaviorSubject<firebase.User | null>(null);
  private _authenticationState = new BehaviorSubject<boolean>(false);
  authErrorSubject = new Subject<string>();

  constructor(
    private afAuth: AngularFireAuth,
    private ngFirestore: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.user.subscribe((user: firebase.User | null) => {
      if (user) {
        this.authenticationState.next(true);
        this._authUser.next(user);
      } else {
        this._authenticationState.next(false);
        this._authUser.next(null);
        this.router.navigate(['auth']);
      }
    });
  }

  async login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((_userCredential) => {
        console.log(_userCredential.user);

        this.authenticationState.next(true);
        this.router.navigate(['']);
      })
      .catch((error) => {
        console.log('An error occured while logging in: %o', error);
        this.handleError(error);
      });
  }

  signUp(email: string, password: string, displayName: string) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential: firebase.auth.UserCredential) => {
        // successful signup
        if (userCredential.user) {
          userCredential.user
            .updateProfile({ displayName: displayName })
            .catch((error) => {
              console.log(
                "An error occurred while setting the new user's display name: %o",
                error
              );
            });
          this.createNewChatUser(userCredential.user, displayName);
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

  // eventually want to move this to the backend with some cloud functions.
  // especially since userChatrooms need to be created too, which has no
  // business here
  private createNewChatUser(user: firebase.User, displayName: string) {
    const newChatUser = new ChatUser(
      user.uid,
      user.email,
      user.photoURL,
      displayName
    );

    try {
      this.ngFirestore
        .collection<ChatUser>('chatUsers')
        .ref.withConverter(CHAT_USER_CONVERTER)
        .doc(user.uid)
        .set(newChatUser);
    } catch (error) {
      console.log(
        'Error occurred while creating chatUser in the database: %o',
        error
      );
    }

    try {
      this.ngFirestore
        .collection<UserChatrooms>('userChatrooms')
        .doc(user.uid)
        .set({ chatrooms: [] });
    } catch (error) {
      console.log(
        'Error occurred while creating userChatrooms for new user: %o',
        error
      );
    }
  }

  public get authUser(): BehaviorSubject<firebase.User | null> {
    return this._authUser;
  }

  public get authenticationState(): BehaviorSubject<boolean> {
    return this._authenticationState;
  }
}
