import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  activeChatroomID: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap);

    this.activeChatroomID = this.route.snapshot.paramMap.get('chatroomID');
    console.log(`activeChatroomID: ${this.activeChatroomID}`);

    this.route.paramMap.subscribe((params: Params) => {
      this.activeChatroomID = params['chatroomID'];
    });
  }
}
