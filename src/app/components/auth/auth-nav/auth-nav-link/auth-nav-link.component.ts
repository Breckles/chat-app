import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-auth-nav-link',
  templateUrl: './auth-nav-link.component.html',
  styleUrls: ['./auth-nav-link.component.scss'],
})
export class AuthNavLinkComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  userSub = new Subscription();

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.userObservable.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  onLogout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
