import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-settings-security-password',
  templateUrl: './settings-security-password.component.html',
  styleUrls: ['./settings-security-password.component.scss']
})
export class SettingsSecurityPasswordComponent implements OnInit {

  public submit = false;
  private _password: string;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  public onCancel() {
    this._password = "";
    this.submit = false;
  }

  // need user to reauthenticate
  public onSubmit(data) {
    this._password = data.password;
    this.submit = true;
  }

  public onReauth() {
    this.auth.user.password = this._password;
    this.onCancel();
  }

}
