import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnDestroy {

  public target: string;

  private _watcher;

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.target = _route.firstChild.routeConfig.path;
    this._watcher = _router.events.subscribe(res => { if (res instanceof NavigationEnd) this.updateMenu(res) });
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  updateMenu(params: NavigationEnd) {
    this.target = params.urlAfterRedirects.replace(/\/settings\/?/g,'');
  }

}
