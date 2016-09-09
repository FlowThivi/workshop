import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-settings-security-delete-account',
  templateUrl: './settings-security-delete-account.component.html',
  styleUrls: ['./settings-security-delete-account.component.scss']
})
export class SettingsSecurityDeleteAccountComponent implements OnInit {

  public submit = false;

  constructor(public auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  public onCancel() {
    this.submit = false;
  }

  public onSubmit() {
    this.submit = true;
  }

  public onReauth() {
    this.onCancel();
    this.auth.user.delete()
      .subscribe(res => {
        this.auth.logout();
        this._router.navigate(['login']);
      });
  }

}
