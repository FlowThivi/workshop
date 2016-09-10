import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthenticatedGuard, NotAuthenticatedGuard } from './auth-guards';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from './auth.service';
import { myFirebaseConfig, myFirebaseAuthConfig } from './shared/angularfire.config';
import { DropdownModule } from 'ng2-bootstrap/ng2-bootstrap';

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsMainComponent } from './settings/settings-main/settings-main.component';
import { SettingsSecurityComponent } from './settings/settings-security/settings-security.component';
import { SettingsMainNameComponent } from './settings/settings-main/settings-main-name/settings-main-name.component';
import { SettingsSecurityProvidersComponent } from './settings/settings-security/settings-security-providers/settings-security-providers.component';
import { SettingsMainEmailComponent } from './settings/settings-main/settings-main-email/settings-main-email.component';
import { SettingsSecurityDeleteAccountComponent } from './settings/settings-security/settings-security-delete-account/settings-security-delete-account.component';
import { CapitalizePipe } from './capitalize.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    NavbarComponent,
    HomeComponent,
    SettingsComponent,
    SettingsMainComponent,
    SettingsSecurityComponent,
    SettingsMainNameComponent,
    SettingsSecurityProvidersComponent,
    SettingsMainEmailComponent,
    SettingsSecurityDeleteAccountComponent,
    CapitalizePipe
  ],
  imports: [
    // cf. ./shared/angularfire.config.ts
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
