import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ChatUser } from '../../auth/models/chat-user.model';
import { ChatroomInfo } from '../models/chatroom.model';

@Component({
  selector: 'app-user-chatrooms',
  templateUrl: './user-chatrooms.component.html',
  styleUrls: ['./user-chatrooms.component.scss'],
})
export class UserChatroomsComponent implements OnInit {
  chatrooms: ChatroomInfo[] | null = null;

  constructor(private authservice: AuthService) {}

  ngOnInit(): void {
    this.authservice.chatUserBehaviorSubject.subscribe(
      (chatUser: ChatUser | null) => {
        if (chatUser) {
          this.chatrooms = <ChatroomInfo[]>chatUser.chatrooms;
        } else {
          this.chatrooms = null;
        }
      }
    );
  }
}
