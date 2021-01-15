import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/database';

import { ChatRoom } from '../interfaces/chatRoom.interface';
import { ChatMessage } from '../interfaces/chatMessage.interface';

@Component({
  selector: 'app-chat-display',
  templateUrl: './chat-display.component.html',
  styleUrls: ['./chat-display.component.scss'],
})
export class ChatDisplayComponent implements OnInit {
  chatRoom!: Observable<ChatMessage[]>;

  constructor(private fireDb: AngularFireDatabase) {}

  ngOnInit(): void {
    this.chatRoom = this.fireDb.list('chatRoom').valueChanges() as Observable<
      ChatMessage[]
    >;
  }
}
