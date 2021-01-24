import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { AuthPage } from './pages/auth/auth.page';
import { AuthComponent } from './components/auth/auth.component';
import { AuthNavComponent } from './components/auth/auth-nav/auth-nav.component';
import { AuthNavLinkComponent } from './components/auth/auth-nav/auth-nav-link/auth-nav-link.component';

import { HomePage } from './pages/home/home.page';

import { ChatPage } from './pages/chat/chat.page';
import { ChatComponent } from './components/chat/chat.component';
import { ChatDisplayComponent } from './components/chat/chat-display/chat-display.component';
import { ChatTextInputComponent } from './components/chat/chat-text-input/chat-text-input.component';
import { HeaderComponent } from './components/header/header.component';
import { ChatCreateComponent } from './components/chat/chat-create/chat-create.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthPage,
    HomePage,
    ChatPage,
    ChatComponent,
    ChatDisplayComponent,
    ChatTextInputComponent,
    AuthComponent,
    AuthNavComponent,
    AuthNavLinkComponent,
    HeaderComponent,
    ChatCreateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
