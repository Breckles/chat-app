import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from './chat.service';
import { ChatMessage } from './models/chatMessage.model';
import { Chatroom } from './models/chatroom.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  chatroomSubscription!: Subscription;
  chatroomMessagesObservable: Observable<ChatMessage[]> | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatroomSubscription = this.chatService.chatroomBehaviorSubject.subscribe(
      (chatroom: Chatroom | null) => {
        if (chatroom !== null) {
          this.chatroomMessagesObservable = chatroom.getMessagesObservable();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.chatroomSubscription.unsubscribe();
  }
}
