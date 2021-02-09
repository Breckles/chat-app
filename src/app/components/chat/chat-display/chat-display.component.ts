import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { ChatMessage } from '../models/chatMessage.model';

@Component({
  selector: 'app-chat-display',
  templateUrl: './chat-display.component.html',
  styleUrls: ['./chat-display.component.scss'],
})
export class ChatDisplayComponent implements OnInit, OnDestroy {
  public chatMessages: ChatMessage[] = [];
  private chatMessageSubscription!: Subscription;

  @Input()
  chatMessagesObs!: Observable<ChatMessage[]>;
  @Input()
  currentUserID!: string;
  @ViewChild('chatMessageList')
  chatMessageListElRef!: ElementRef<HTMLUListElement>;

  constructor() {}

  ngOnInit(): void {
    this.chatMessageSubscription = this.chatMessagesObs.subscribe(
      (chatMessages: ChatMessage[]) => {
        this.chatMessages.push(...chatMessages);
      }
    );
  }

  ngOnDestroy(): void {
    this.chatMessageSubscription.unsubscribe();
  }
}
