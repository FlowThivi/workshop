import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-settings-main-email',
  templateUrl: './settings-main-email.component.html',
  styleUrls: ['./settings-main-email.component.scss']
})
export class SettingsMainEmailComponent implements OnInit {

  public submit = false;
  private _email: string;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  public onCancel() {
    this._email = "";
    this.submit = false;
  }

  // need user to reauthenticate
  public onSubmit(data) {
    this._email = data.form.value.email.toLowercase();
    this.submit = true;
  }

  public onReauth() {
    this.auth.user.email = this._email;
    this.onCancel();
  }

}

