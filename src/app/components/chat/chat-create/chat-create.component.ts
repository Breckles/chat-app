import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat-create',
  templateUrl: './chat-create.component.html',
  styleUrls: ['./chat-create.component.scss'],
})
export class ChatCreateComponent implements OnInit {
  chatroomCreateForm = new FormGroup({
    chatroomName: new FormControl('', [Validators.required]),
  });

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  onCreateChatroom() {
    if (this.chatroomCreateForm.valid) {
      const chatroomName: string = this.chatroomCreateForm.get('chatroomName')!
        .value;
      this.chatService.createChatroom(chatroomName);
      this.chatroomCreateForm.reset();
    }
  }
}
