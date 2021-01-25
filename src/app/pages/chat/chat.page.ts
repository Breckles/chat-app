import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/components/chat/chat.service';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  currentChatroomID: string | null = null;
  queryParamSub!: Subscription;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.queryParamSub = this.route.queryParamMap.subscribe(
      (params: ParamMap) => {
        this.currentChatroomID = params.get('chatroomID');
        if (this.currentChatroomID) {
          this.chatService.setChatroom(this.currentChatroomID);
        }
        console.log('in chat page query param callback');
      }
    );
  }

  ngOnDestroy() {
    this.queryParamSub.unsubscribe();
  }
}
