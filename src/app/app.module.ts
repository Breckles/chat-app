import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { ChatPage } from './pages/chat/chat.page';
import { ChatComponent } from './components/chat/chat.component';
import { ChatDisplayComponent } from './components/chat/chat-display/chat-display.component';
import { ChatTextInputComponent } from './components/chat/chat-text-input/chat-text-input.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ChatPage,
    ChatComponent,
    ChatDisplayComponent,
    ChatTextInputComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
