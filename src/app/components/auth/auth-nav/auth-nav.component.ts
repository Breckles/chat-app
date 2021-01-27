import { Component, OnInit } from '@angular/core';

import { User } from '@firebase/auth-types';

import { AuthService } from '../auth.service';
import { ChatUser } from '../models/chat-user.model';

@Component({
  selector: 'app-auth-nav',
  templateUrl: './auth-nav.component.html',
  styleUrls: ['./auth-nav.component.scss'],
})
export class AuthNavComponent implements OnInit {
  chatUser: ChatUser | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.authenticationState.subscribe((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        this.chatUser = this.auth.chatUser;
      } else {
        this.chatUser = null;
      }
    });
  }
}
