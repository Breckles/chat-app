import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../chat.service';
import { ChatMessage } from '../interfaces/chatMessage.interface';

@Component({
  selector: 'app-chat-text-input',
  templateUrl: './chat-text-input.component.html',
  styleUrls: ['./chat-text-input.component.scss'],
})
export class ChatTextInputComponent implements OnInit {
  messageForm = new FormGroup({
    messageInput: new FormControl('', [Validators.required]),
  });

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  public onSend() {
    if (this.messageForm.valid) {
      const message: ChatMessage = {
        value: this.messageForm.get('messageInput')!.value,
        author: 'user',
        timeStamp: `${new Date()}`,
      };
      this.chatService.sendMessage(message);
    }
  }
}
