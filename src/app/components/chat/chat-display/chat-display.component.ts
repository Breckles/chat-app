import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ChatMessage } from '../interfaces/chatMessage.interface';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-display',
  templateUrl: './chat-display.component.html',
  styleUrls: ['./chat-display.component.scss'],
})
export class ChatDisplayComponent implements OnInit {
  chatMessagesObs!: Observable<ChatMessage[]>;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatMessagesObs = this.chatService.getChatMessagesObservable();
  }
}
