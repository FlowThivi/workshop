import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthenticatedGuard, NotAuthenticatedGuard } from './auth-guards';
import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';
import { AuthService } from './auth.service';

import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsMainComponent } from './settings/settings-main/settings-main.component';
import { SettingsSecurityComponent } from './settings/settings-security/settings-security.component';

const myFirebaseConfig = {
  apiKey: "AIzaSyDR2mmzMnymCaZb2VK3lymN-Y5VNtH5kfM",
  authDomain: "a2app-14909.firebaseapp.com",
  databaseURL: "https://a2app-14909.firebaseio.com",
  storageBucket: "a2app-14909.appspot.com",
}

const myFirebaseAuthConfig = {
  method: AuthMethods.Popup
}

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavbarComponent,
    HomeComponent,
    SettingsComponent,
    SettingsMainComponent,
    SettingsSecurityComponent
  ],
  imports: [
    AngularFireModule.initializeApp(myFirebaseConfig, myFirebaseAuthConfig),
    DropdownModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    AuthenticatedGuard,
    NotAuthenticatedGuard,
    appRoutingProviders,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
