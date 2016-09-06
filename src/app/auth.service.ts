import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { AngularFire, AuthProviders } from 'angularfire2';

import { User } from './user';

@Injectable()
export class AuthService implements OnDestroy {

  // utilisateur courant
  private _user: User;

  // indication de connexion
  private _authenticated: boolean;

  private _watcher;

  private _loading: boolean;

  constructor(private af: AngularFire) {
    this._watcher = af.auth.subscribe(res => this._connect(res));
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  public get authenticated(): Observable<boolean> {
    return Observable.create(observer => {
      this.af.auth.subscribe(res => observer.next(res && !!this._authenticated && !!this.user));
    }).take(1);
  }

  public get user() {
    return this._user;
  }

  public get loading() {
    return !!this._loading;
  }

  public loginWith(provider: string): Observable<any> {
    let params;

    switch(provider) {
      case 'google':
        params = {
          provider: AuthProviders.Google
        }
        break;
      case 'github':
        params = {
          provider: AuthProviders.Github
        }
        break;
    }

    return this._login(params);
  }

  public logout(): Observable<any> {
    this._loading = true;

    return Observable.create(observer => {
      this._deconnect();

      this.af.auth.logout();

      this._loading = false;

      observer.next();
    }).take(1);
  }

  private _login(params): Observable<any> {
    this._loading = true;

    return Observable.create(observer => {
      this.af.auth.login(params)
        .then(res => observer.next(res))
        .catch(err => this._getError(err));
    });

  }

  private _getError(error) {
    this._loading = false;

    this.authenticated.subscribe(res => { if (res) this.logout() });

    setTimeout(() => {
      switch(error.code) {
        case 'auth/popup-closed-by-user':
          break;
        case 'auth/account-exists-with-different-credential':
          alert(`${error.email} est déjà lié à un compte avec un moyen de connexion différent. Connectez-vous avec celui-ci`);
          break;
        default:
          break;
      }
    });

  }

  private _connect(auth) {
    // si la procédure a été interrompue, on essaye de connecter l'utilisateur depuis le cache
    //if (!auth) this.af.auth.subscribe(auth => this._connect(auth));

    this.authenticated.subscribe(res => {
      if (res || !auth) return;

      this._user = new User(auth);

      this._authenticated = true;

      this._loading = false;
    });

  }

  private _deconnect() {
    this.authenticated.subscribe(res => {
      if (!res) return;

      delete this._user;

      this._authenticated = false;
    });
  }

}
