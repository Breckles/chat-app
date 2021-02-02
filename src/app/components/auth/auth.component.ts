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
    displayName: new FormControl('', [Validators.required]),
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
      this.authForm.addControl(
        'displayName',
        new FormControl('', [Validators.required])
      );
    }

    this.queryParamSub = this.route.queryParams.subscribe((params: Params) => {
      this.authForm.reset();
      if (params['authMode'] === 'signup') {
        this.authMode = 'signup';
        this.authForm.addControl(
          'displayName',
          new FormControl('', [Validators.required])
        );
      } else {
        this.authMode = 'login';
        this.authForm.removeControl('displayName');
      }
    });

    this.authService.authErrorSubject.subscribe((errorMessage) => {
      this.errorMessage = errorMessage;
    });
  }

  getFormControl(controlName: string) {
    return this.authForm.get(controlName)! as FormControl;
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.authForm.valid) {
      const email: string = this.authForm.get('email')!.value;
      const password: string = this.authForm.get('password')!.value;

      if (this.authMode === 'login') {
        this.authService.login(email, password);
      } else {
        const displayName: string = this.authForm.get('displayName')!.value;
        this.authService.signUp(email, password, displayName);
      }

      this.authForm.reset();
    }
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.queryParamSub.unsubscribe();
  }
}
