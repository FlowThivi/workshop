import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth.service';
import { OAuthProvider } from '../../o-auth-provider';
import { Loader } from '../../loader';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public load: Loader;

  constructor(public auth: AuthService, private _router: Router) {
    this.load = new Loader();
  }

  ngOnInit() {
  }

  onSignup(provider: OAuthProvider, data?: any) {
    this.load.start();

    this.auth.signUp(provider, data)
      .subscribe(() => {
        this.load.stop();
        this._router.navigate(['']);
      });
  }

}
