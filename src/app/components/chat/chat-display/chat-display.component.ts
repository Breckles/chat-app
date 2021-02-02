import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ChatMessage } from '../models/chatMessage.model';

@Component({
  selector: 'app-chat-display',
  templateUrl: './chat-display.component.html',
  styleUrls: ['./chat-display.component.scss'],
})
export class ChatDisplayComponent implements OnInit {
  @Input()
  chatMessagesObs!: Observable<ChatMessage[]>;
  @Input()
  currentUserID!: string | null;

  constructor() {}

  ngOnInit(): void {}
}
