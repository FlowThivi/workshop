import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth.service';
import { OAuthProvider } from '../o-auth-provider';
import { Loader } from '../loader';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  @Output() reauth: EventEmitter<any> = new EventEmitter();

  public load: Loader;

  constructor(public auth: AuthService, private _router: Router) {
    this.load = new Loader();
  }

  ngOnInit() {
  }

  onLogin(provider: OAuthProvider, data?: any) {
    this.load.start();

    this.auth.loginWith(provider, data)
      .subscribe(() => {
        this.load.stop();
        this._router.navigate(['']);
      });
  }

  onReauth(provider: OAuthProvider, data?: any) {
    this.load.start();

    this.auth.loginWith(provider, data)
      .subscribe(() => {
        this.load.stop();
        this.reauth.emit();
      });
  }

  onLogout() {
    this.auth.logout()
      .subscribe(() => console.log('déconnecté'));
  }

}
