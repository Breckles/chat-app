import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { AuthPage } from './pages/auth/auth.page';
import { HomePage } from './pages/home/home.page';
import { ChatPage } from './pages/chat/chat.page';
import { ChatComponent } from './components/chat/chat.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo('auth');

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'auth', component: AuthPage },
  {
    path: 'chat',
    component: ChatPage,
    ...canActivate(redirectUnauthorizedToLogin),
    children: [{ path: ':chatroomID', component: ChatComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
