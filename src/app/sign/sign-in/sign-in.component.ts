import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth.service';
import { OAuthProvider } from '../../o-auth-provider';
import { Loader } from '../../loader';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @Output() reauth: EventEmitter<any> = new EventEmitter();

  public load: Loader;

  constructor(public auth: AuthService, private _router: Router) {
    this.load = new Loader();
  }

  ngOnInit() {
  }

  onSignin(provider: OAuthProvider, data?: any) {
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

}
