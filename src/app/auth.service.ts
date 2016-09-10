import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { OAUTH_PROVIDERS } from './shared/oauth.config';

import { Error } from './error';
import { User } from './user';
import { OAuthProvider } from './o-auth-provider';

@Injectable()
export class AuthService implements OnDestroy {

  // current user (cf. ./user)
  private _user: User;

  private _authenticated: boolean;

  // subscribtion object to unsubscribe on logout
  private _watcher;

  // subscribtion object to unsubscribe link and unlink methods
  private _linkwatcher;

  // available providers (cf ./o-auth-provider)
  private _providers: Array<OAuthProvider> = [];

  constructor(private _af: AngularFire) {
    // populate providers
    for (let providerId of OAUTH_PROVIDERS)
      this._providers.push(new OAuthProvider(providerId));

    // subscribtion on the auth object, _connect method is triggered
    // every time the user is logged in
    this._watcher = _af.auth.subscribe(res => this._connect(res));
  }

  ngOnDestroy() {
    // unsubscribe the watcher when the service is destroyed
    this._watcher.unsubscribe();
  }

  public get authenticated(): Observable<boolean> {
    // verifying if the user is logged in server-side, front-side and if the user object
    // is instancied
    return Observable.create(observer => {
      this._af.auth.subscribe(res => { observer.next(res && !!this._authenticated && !!this.user) });
    }).take(1);
  }

  public get providers() {
    return this._providers;
  }

  public get user() {
    return this._user;
  }

  
  public changeEmail(email: string) {
    // trying to delete the current user server-side. The user need to be reauthenticated
    // cf. ./settings/settings-security/settings-security-delete-account
    this._af.auth
      .subscribe(res => {
        res.auth.updateEmail(email);
      });
  }

  public deleteAccount(): Observable<any> {
    // trying to delete the current user server-side. The user need to be reauthenticated
    // cf. ./settings/settings-security/settings-security-delete-account
    return Observable.create(observer => {
      this._af.auth
        .subscribe(res => {
          res.auth.delete()
            .then(res => {
              observer.next();
            });
        });
    });
  }

  public link(provider: OAuthProvider): Observable<any> {
    return Observable.create(observer => {
      this._linkwatcher = this._af.auth
        .subscribe(res => {
          if (provider.active) return;
          provider.active = true;

          res.auth.linkWithPopup(provider.provider)
            .then(res => {
              this._linkwatcher.unsubscribe();
              this._updateProviders(res.user);
              observer.next(true);
            })
            .catch(err => {
              provider.active = false;
              new Error(err).alert();
              observer.next(false);
            });
        });
    }).take(1);
  }

  public logout(): Observable<any> {
    return Observable.create(observer => {
      this._deconnect();

      this._af.auth.logout();

      observer.next();
    }).take(1);
  }

  public loginWith(provider: OAuthProvider): Observable<any> {
    return Observable.create(observer => {
      this._af.auth.login({
        provider: provider.aprovider
      })
        .then(res => {
          observer.next(res);
        })
        .catch(err => {
          new Error(err).alert();
          observer.next(false);
        });
    });
  }

  public unlink(provider: OAuthProvider): Observable<any> {
    return Observable.create(observer => {
      this._linkwatcher = this._af.auth.subscribe(res => {
        if (!provider.active) return;
        provider.active = false;

        res.auth.unlink(provider.id)
          .then(res => {
            this._linkwatcher.unsubscribe();
            this._updateProviders(res);
            observer.next(res);
          })
          .catch(err => {
            provider.active = true;
            new Error(err).alert();
            observer.next(false);
          });
      });
    }).take(1);
  }

  private _updateProviders(params) {
    if (!params) return;

    for (let provider of this._providers) {
      provider.active = false;

      for (let data of params.providerData) {
        if (provider.id == data.providerId) {
          provider.active = true;
          provider.email = data.email;
        }
      }
    }
  }

  private _connect(params) {
    this.authenticated.subscribe(res => {
      if (res || !params) return;

      let auth = params.auth;

      this._updateProviders(auth);

      this._user = new User(this, this._af.database.object(`/users/${auth.uid}`), auth);

      this._authenticated = true;
    });

  }

  private _deconnect() {
    this.authenticated.subscribe(res => {
      if (!res) return;

      this.user.ngOnDestroy();

      delete this._user;

      this._authenticated = false;
    });
  }

}
