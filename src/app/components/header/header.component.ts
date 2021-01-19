import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  private userSub = new Subscription();

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.auth.getUserObservable().subscribe((user) => {
      this.isAuthenticated = user ? true : false;
    });
  }
}
