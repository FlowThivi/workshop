import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  onLogout() {
    this.auth.logout()
      .subscribe(() => console.log('déconnecté'));
  }

}
