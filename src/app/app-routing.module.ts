import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatPage } from './pages/chat/chat.page';

const routes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'chat', component: ChatPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
