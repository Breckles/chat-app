import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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
  userChatroomsObservableSubscription!: Subscription;

  constructor(private chatUserService: ChatUserService) {}

  ngOnInit(): void {
    this.userChatroomsSubscription = this.chatUserService.chatUserChatrooms.subscribe(
      (
        userChatroomsObservable: Observable<UserChatrooms | undefined> | null
      ) => {
        if (userChatroomsObservable) {
          this.userChatroomsObservableSubscription = userChatroomsObservable.subscribe(
            (userChatrooms: UserChatrooms | undefined) => {
              if (userChatrooms) {
                this.chatrooms = userChatrooms.chatrooms as ChatroomInfo[];
              } else {
                this.chatrooms = [];
              }
            }
          );
        } else {
          this.chatrooms = [];
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.userChatroomsSubscription) {
      this.userChatroomsSubscription.unsubscribe();
    }
    if (this.userChatroomsObservableSubscription) {
      this.userChatroomsObservableSubscription.unsubscribe();
    }
  }
}
