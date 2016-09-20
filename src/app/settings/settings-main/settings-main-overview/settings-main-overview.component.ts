import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-settings-main-overview',
  templateUrl: './settings-main-overview.component.html',
  styleUrls: ['./settings-main-overview.component.scss']
})
export class SettingsMainOverviewComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
