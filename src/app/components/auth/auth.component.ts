import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  errorMessage = '';
  authMode: 'signup' | 'signin' = 'signin';
  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authErrorSubject.subscribe((errorMessage) => {
      this.errorMessage = errorMessage;
    });
  }

  onSubmit() {
    if (this.authForm.valid) {
      const email: string = this.authForm.get('email')!.value;
      const password: string = this.authForm.get('password')!.value;

      let authPromise;

      if (this.authMode === 'signin') {
        this.authService.login(email, password);
      } else {
        this.authService.signUp(email, password);
      }
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

  onLogout() {
    this.authService.logout();
  }
}
