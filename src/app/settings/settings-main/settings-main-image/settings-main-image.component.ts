import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-settings-main-image',
  templateUrl: './settings-main-image.component.html',
  styleUrls: ['./settings-main-image.component.scss']
})
export class SettingsMainImageComponent implements OnInit {

  public src: any;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  public onChange(files: any) {
    let reader = new FileReader();

    reader.addEventListener("load", () => {
      this.src = reader.result;
      this.auth.user.pic = files[0];
    }, false);

    reader.readAsDataURL(files[0]);
  }

}
