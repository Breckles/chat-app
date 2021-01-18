import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// interface AdditionalUserInfo {
//   isNewUser: boolean;
//   profile: Object | null;
//   providerId: string;
//   username?: string | null;
// }

// interface AuthCredential {
//   providerId: string;
//   signInMethod: string;
// }

// interface UserCredential {
//   additionalUserInfo: AdditionalUserInfo | null;
//   credential: AuthCredential | null;
//   operationType?: string | null;
// }

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  authMode: 'signup' | 'signin' = 'signin';
  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(private auth: AngularFireAuth) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.authForm.valid) {
      const email: string = this.authForm.get('email')!.value;
      const password: string = this.authForm.get('password')!.value;

      let authPromise;

      if (this.authMode === 'signin') {
        authPromise = this.auth.createUserWithEmailAndPassword(email, password);
      } else {
        authPromise = this.auth.signInWithEmailAndPassword(email, password);
      }

      authPromise
        .then((user) => {
          // user signed up successfully
          console.log(user);
          this.handleLogin(user);
        })
        .catch((error) => {
          // error occured during sign up
          console.log(error);
          const errorCode = error.code;
          const errorMessage = error.message;
          this.handleAuthError();
        });
    }
  }

  toggleAuthMode() {
    if (this.authMode === 'signin') {
      this.authMode = 'signup';
    } else {
      this.authMode = 'signin';
    }
  }

  handleLogin(user: any) {}

  handleAuthError() {}
}
