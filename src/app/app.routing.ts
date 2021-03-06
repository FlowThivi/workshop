import { Routes, RouterModule } from '@angular/router';
import { AuthenticatedGuard, NotAuthenticatedGuard } from './auth-guards';

import { SignComponent } from './sign/sign.component';
import { SignInComponent } from './sign/sign-in/sign-in.component';
import { SignUpComponent } from './sign/sign-up/sign-up.component';

import { HomeComponent } from './home/home.component';

import { SettingsComponent } from './settings/settings.component';
import { SettingsMainComponent } from './settings/settings-main/settings-main.component';
import { SettingsMainOverviewComponent } from './settings/settings-main/settings-main-overview/settings-main-overview.component';
import { SettingsMainNameComponent } from './settings/settings-main/settings-main-name/settings-main-name.component';
import { SettingsMainImageComponent } from './settings/settings-main/settings-main-image/settings-main-image.component';
import { SettingsMainEmailComponent } from './settings/settings-main/settings-main-email/settings-main-email.component';

import { SettingsSecurityComponent } from './settings/settings-security/settings-security.component';

import { SettingsNotificationsComponent } from './settings/settings-notifications/settings-notifications.component';

// cf. ./auth-guards to more guards infos

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthenticatedGuard] },
  { path: 'sign', component: SignComponent, canActivate: [NotAuthenticatedGuard],
    children: [
      { path: 'in', component: SignInComponent },
      { path: 'up', component: SignUpComponent },
      { path: '', redirectTo: 'in' },
    ]
  },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthenticatedGuard],
    children: [
      { path: 'main', component: SettingsMainComponent,
        children: [
          { path: '', component: SettingsMainOverviewComponent },
          { path: 'name', component: SettingsMainNameComponent },
          { path: 'image', component: SettingsMainImageComponent },
          { path: 'email', component: SettingsMainEmailComponent },
        ]
      },
      { path: 'security', component: SettingsSecurityComponent },
      { path: 'notifications', component: SettingsNotificationsComponent },
      { path: '', redirectTo: 'main' },
    ]
  }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
