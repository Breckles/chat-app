import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-nav',
  templateUrl: './auth-nav.component.html',
  styleUrls: ['./auth-nav.component.scss'],
})
export class AuthNavComponent implements OnInit {
  isAuthenticated = false;
  userName!: string | null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getUserObservable().subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.userName = user.displayName;
      } else {
        this.isAuthenticated = false;
        this.userName = null;
      }
    });
  }
}
