import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatUserService } from 'src/app/chat-user.service';
import { ChatroomInfo } from '../models/chatroom.model';
import { UserChatrooms } from '../models/userChatrooms.model';

@Component({
  selector: 'app-user-chatrooms',
  templateUrl: './user-chatrooms.component.html',
  styleUrls: ['./user-chatrooms.component.scss'],
})
export class UserChatroomsComponent implements OnInit, OnDestroy {
  chatrooms: ChatroomInfo[] = [];
  userChatroomsSubscription!: Subscription;

  constructor(private chatUserService: ChatUserService) {}

  ngOnInit(): void {
    this.userChatroomsSubscription = this.chatUserService.chatUserChatrooms.subscribe(
      (userChatrooms: UserChatrooms | null) => {
        if (userChatrooms) {
          this.chatrooms = userChatrooms.chatrooms as ChatroomInfo[];
        } else {
          this.chatrooms = [];
        }
      }
    );
  }

  ngOnDestroy() {
    this.userChatroomsSubscription.unsubscribe();
  }
}
