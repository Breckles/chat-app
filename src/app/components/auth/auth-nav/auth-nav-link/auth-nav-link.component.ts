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
  private authStateSub!: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.authenticationState.subscribe((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  onLogout() {
    this.auth.logout();
  }

  ngOnDestroy() {
    this.authStateSub.unsubscribe();
  }
}
