import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

interface AuthError {
  code: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authErrorSubject = new Subject<string>();

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  login(email: string, password: string) {
    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // successful login
        console.log('Login UserCredential: ' + userCredential);
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
      .then((userCredential) => {
        // successful signup
        console.log('Signup UserCredential: ' + userCredential);
        this.handleLogin();
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

  private handleLogin() {
    // console.log('User Observable: ' + this.afAuth.user);
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
}
