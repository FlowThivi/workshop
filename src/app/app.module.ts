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
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsMainComponent } from './settings/settings-main/settings-main.component';
import { SettingsSecurityComponent } from './settings/settings-security/settings-security.component';
import { SettingsMainNameComponent } from './settings/settings-main/settings-main-name/settings-main-name.component';
import { SettingsSecurityProvidersComponent } from './settings/settings-security/settings-security-providers/settings-security-providers.component';
import { SettingsMainEmailComponent } from './settings/settings-main/settings-main-email/settings-main-email.component';
import { SettingsMainImageComponent } from './settings/settings-main/settings-main-image/settings-main-image.component';
import { SettingsSecurityDeleteAccountComponent } from './settings/settings-security/settings-security-delete-account/settings-security-delete-account.component';
import { CapitalizePipe } from './capitalize.pipe';
import { SettingsNotificationsComponent } from './settings/settings-notifications/settings-notifications.component';
import { SettingsMainOverviewComponent } from './settings/settings-main/settings-main-overview/settings-main-overview.component';
import { SettingsSecurityPasswordComponent } from './settings/settings-security/settings-security-password/settings-security-password.component';
import { SignComponent } from './sign/sign.component';
import { SignInComponent } from './sign/sign-in/sign-in.component';
import { SignUpComponent } from './sign/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    SettingsComponent,
    SettingsMainComponent,
    SettingsSecurityComponent,
    SettingsMainNameComponent,
    SettingsSecurityProvidersComponent,
    SettingsMainEmailComponent,
    SettingsMainImageComponent,
    SettingsSecurityDeleteAccountComponent,
    CapitalizePipe,
    SettingsNotificationsComponent,
    SettingsMainOverviewComponent,
    SettingsSecurityPasswordComponent,
    SignComponent,
    SignInComponent,
    SignUpComponent
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
