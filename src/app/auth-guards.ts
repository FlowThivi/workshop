import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private _auth: AuthService, private _router: Router) {}

  canActivate(): Observable<boolean>|Promise<boolean>|boolean {
    return Observable.create(observer => {
      this._auth.authenticated
        .subscribe(res => {
          if(res)
            observer.next(true);
          else {
            observer.next(false);
            this._router.navigate(['login']);
          }
        });
    }).take(1);
  }
}

@Injectable()
export class NotAuthenticatedGuard implements CanActivate {
  constructor(private _auth: AuthService, private _router: Router) {}

  canActivate(): Observable<boolean>|Promise<boolean>|boolean {
    return Observable.create(observer => {
      this._auth.authenticated
        .subscribe(res => {
          if(!res)
            observer.next(true);
          else {
            observer.next(false);
            this._router.navigate(['']);
          }
        });
    }).take(1);
  }
}
