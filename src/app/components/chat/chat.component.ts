import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from './chat.service';
import { ChatMessage } from './interfaces/chatMessage.interface';
import { ChatRoom } from './interfaces/chatRoom.interface';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  chatroomMessagesSub!: Subscription;
  chatroomMessagesObs!: Observable<ChatMessage[]> | null;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatroomMessagesObs = this.chatService.getChatMessagesObservable();
  }
}
