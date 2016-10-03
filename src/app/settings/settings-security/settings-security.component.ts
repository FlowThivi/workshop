import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-settings-security',
  templateUrl: './settings-security.component.html',
  styleUrls: ['./settings-security.component.scss']
})
export class SettingsSecurityComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
