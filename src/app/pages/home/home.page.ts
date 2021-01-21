import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/components/auth/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  isAuthenticated: boolean = false;
  authStateSubscription!: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.authStateSubscription = this.auth.authenticationState.subscribe(
      (isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  ngOnDestroy() {
    this.authStateSubscription.unsubscribe();
  }
}
