import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authStateSub!: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.authStateSub = this.auth.authenticationState.subscribe(
      (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  ngOnDestroy() {
    this.authStateSub.unsubscribe();
  }
}
