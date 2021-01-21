import { Component, OnInit } from '@angular/core';

import { User } from '@firebase/auth-types';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-nav',
  templateUrl: './auth-nav.component.html',
  styleUrls: ['./auth-nav.component.scss'],
})
export class AuthNavComponent implements OnInit {
  user: User | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.userObservable.subscribe((user) => {
      this.user = user;
    });
  }
}
