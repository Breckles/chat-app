import { Component, OnInit } from '@angular/core';

import { ChatUser } from '../../../models/chat-user.model';
import { ChatUserService } from 'src/app/chat-user.service';

@Component({
  selector: 'app-auth-nav',
  templateUrl: './auth-nav.component.html',
  styleUrls: ['./auth-nav.component.scss'],
})
export class AuthNavComponent implements OnInit {
  chatUser: ChatUser | null = null;

  constructor(private chatUserService: ChatUserService) {}

  ngOnInit(): void {
    this.chatUserService.chatUser.subscribe((chatUser: ChatUser | null) => {
      this.chatUser = chatUser;
    });
  }
}
