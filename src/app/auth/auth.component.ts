import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(public auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  onLogin(provider: string) {
    this.auth.loginWith(provider)
      .subscribe(() => this._router.navigate(['/']));
  }

  onLogout() {
    this.auth.logout()
      .subscribe(() => console.log('déconnecté'));
  }

}
