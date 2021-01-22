import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
  errorMessage = '';
  authMode: string = 'login';
  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  private queryParamSub!: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const authModeParam: string = this.route.snapshot.queryParams['authMode'];

    if (authModeParam === 'signup') {
      this.authMode = 'signup';
    }

    this.queryParamSub = this.route.queryParams.subscribe((params: Params) => {
      if (params['authMode'] === 'signup') {
        this.authMode = 'signup';
      } else {
        this.authMode = 'login';
      }
    });

    this.authService.authErrorSubject.subscribe((errorMessage) => {
      this.errorMessage = errorMessage;
    });
  }

  onSubmit() {
    if (this.authForm.valid) {
      const email: string = this.authForm.get('email')!.value;
      const password: string = this.authForm.get('password')!.value;

      if (this.authMode === 'login') {
        this.authService.login(email, password);
      } else {
        this.authService.signUp(email, password);
      }
    }
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.queryParamSub.unsubscribe();
  }
}
