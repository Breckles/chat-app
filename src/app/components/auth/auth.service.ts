import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { User, UserCredential } from '@firebase/auth-types';

import * as firebase from 'firebase';

interface AuthError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User | null = null;
  authErrorSubject = new Subject<string>();

  constructor(
    private afAuth: AngularFireAuth,
    private fireDB: AngularFireDatabase,
    private router: Router
  ) {
    this.afAuth.user.subscribe((user) => {
      this.user = user;
    });
  }

  login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential: UserCredential) => {
        // successful login
        this.handleLogin(userCredential.user);
      })
      .catch((error: AuthError) => {
        // error during login
        this.handleError(error);
      });
  }

  signUp(email: string, password: string) {
    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential: UserCredential) => {
        // successful signup
        this.createNewUser(userCredential.user);
        this.handleLogin(userCredential.user);
      })
      .catch((error: AuthError) => {
        // error during signup
        this.handleError(error);
      });
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['auth']);
  }

  getUserObservable() {
    return this.afAuth.user;
  }

  private handleLogin(user: User | null) {
    // this.user = user;
    this.router.navigate(['chat']);
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
  private createNewUser(user: User | null) {
    if (user && user.email) {
      this.fireDB.database.ref(`users/${user.uid}`).set({ email: user.email });
    }
  }
}
