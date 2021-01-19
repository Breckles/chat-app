import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  AngularFireAuthGuard,
  canActivate,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

import { AuthPage } from './pages/auth/auth.page';
import { ChatPage } from './pages/chat/chat.page';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo('auth');

const routes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'auth', component: AuthPage },
  {
    path: 'chat',
    component: ChatPage,
    ...canActivate(redirectUnauthorizedToLogin),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
