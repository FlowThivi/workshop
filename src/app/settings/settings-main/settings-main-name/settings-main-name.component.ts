import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { CapitalizePipe } from '../../../capitalize.pipe';

@Component({
  selector: 'app-settings-main-name',
  templateUrl: './settings-main-name.component.html',
  styleUrls: ['./settings-main-name.component.scss']
})
export class SettingsMainNameComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  onSubmit(data) {
    this.auth.user.firstname = new CapitalizePipe().transform(data.form.value.firstname);
    this.auth.user.lastname = new CapitalizePipe().transform(data.form.value.lastname);
  }

}
