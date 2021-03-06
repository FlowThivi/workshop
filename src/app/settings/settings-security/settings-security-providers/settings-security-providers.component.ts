import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../auth.service';
import { OAuthProvider } from '../../../o-auth-provider';
import { Loader } from '../../../loader';

@Component({
  selector: 'app-settings-security-providers',
  templateUrl: './settings-security-providers.component.html',
  styleUrls: ['./settings-security-providers.component.scss']
})
export class SettingsSecurityProvidersComponent implements OnInit {

  public load: Loader;

  constructor(public auth: AuthService) {
    this.load = new Loader();
  }

  ngOnInit() {
  }

  public onLink(provider: OAuthProvider) {
    this.load.start();
    this.auth.link(provider)
      .subscribe(() => this.load.stop());
  }

  public onUnlink(provider: OAuthProvider) {
    this.load.start();
    this.auth.unlink(provider)
      .subscribe(() => this.load.stop());
  } 

}
