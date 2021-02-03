import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { ChatService } from './chat.service';
import { ChatUserService } from 'src/app/chat-user.service';

import { ChatUser } from '../../models/chat-user.model';
import { ChatMessage } from './models/chatMessage.model';
import { Chatroom } from './models/chatroom.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  chatUser: ChatUser | null = null;
  chatUserSubscription!: Subscription;
  chatroomSubscription!: Subscription;
  chatroomMessagesObservable: Observable<ChatMessage[]> | null = null;

  constructor(
    private chatUserService: ChatUserService,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.chatUserSubscription = this.chatUserService.chatUser.subscribe(
      (chatUser: ChatUser | null) => {
        if (chatUser !== null) {
          this.chatUser = chatUser;
        } else {
          this.chatUser = null;
        }
      }
    );

    this.chatroomSubscription = this.chatService.currentChatroom.subscribe(
      (chatroom: Chatroom | null) => {
        if (chatroom !== null) {
          this.chatroomMessagesObservable = chatroom.getMessages();
        } else {
          this.chatroomMessagesObservable = null;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.chatUserSubscription.unsubscribe();
    this.chatroomSubscription.unsubscribe();
  }
}
