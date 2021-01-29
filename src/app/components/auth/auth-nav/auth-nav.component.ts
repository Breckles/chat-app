import { Component, OnInit } from '@angular/core';

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
    this.auth.chatUserBehaviorSubject.subscribe((chatUser: ChatUser | null) => {
      if (chatUser) {
        this.chatUser = this.auth.chatUser;
      } else {
        this.chatUser = null;
      }
    });
  }
}
