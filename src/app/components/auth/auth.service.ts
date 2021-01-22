import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { User, UserCredential } from '@firebase/auth-types';

interface AuthError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: User | null = null;
  private _userObservable!: Observable<User | null>;
  private _authenticationState = new BehaviorSubject<boolean>(false);
  authErrorSubject = new Subject<string>();

  constructor(
    private afAuth: AngularFireAuth,
    private fireDB: AngularFireDatabase,
    private router: Router
  ) {
    this._userObservable = this.afAuth.user;
    this._userObservable.subscribe((user) => {
      this._user = user;
      this.authenticationState.next(this.isAuthenticated());
    });
  }

  isAuthenticated() {
    return this.user !== null;
  }

  login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((_userCredential: UserCredential) => {
        // successful login
        this.handleLogin();
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
        this.handleLogin();
      })
      .catch((error: AuthError) => {
        // error during signup
        this.handleError(error);
      });
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['home']);
  }

  private handleLogin() {
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
  private createNewUser(user: User | null) {
    if (user && user.email) {
      this.fireDB.database.ref(`users/${user.uid}`).set({ email: user.email });
    }
  }

  public get user() {
    return this._user;
  }

  public get userObservable() {
    return this._userObservable;
  }

  public get authenticationState() {
    return this._authenticationState;
  }
}
