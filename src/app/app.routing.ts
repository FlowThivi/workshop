import { Routes, RouterModule } from '@angular/router';
import { AuthenticatedGuard, NotAuthenticatedGuard } from './auth-guards';

import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';

import { SettingsComponent } from './settings/settings.component';
import { SettingsMainComponent } from './settings/settings-main/settings-main.component';
import { SettingsMainNameComponent } from './settings/settings-main/settings-main-name/settings-main-name.component';

import { SettingsSecurityComponent } from './settings/settings-security/settings-security.component';

// cf. ./auth-guards to more guards infos

const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthenticatedGuard] },
  { path: 'login', component: AuthComponent, canActivate: [NotAuthenticatedGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthenticatedGuard],
    children: [
      { path: 'main', component: SettingsMainComponent },
      { path: 'security', component: SettingsSecurityComponent },
      { path: '', redirectTo: 'main' },
    ]
  }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
