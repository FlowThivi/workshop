import { Injectable, OnDestroy } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/take';

import { OAUTH_PROVIDERS, PASSWORD_AUTHENTICATION } from './shared/auth.config';

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

  // available providers (cf ./o-auth-provider)
  private _providers: Array<OAuthProvider> = [];

  private _auth;

  constructor(private _af: AngularFire) {
    if (PASSWORD_AUTHENTICATION)
      this._providers.push(new OAuthProvider('password'));

    // populate providers
    for (let providerId of OAUTH_PROVIDERS)
      this._providers.push(new OAuthProvider(providerId));

    // subscribtion on the auth object, _connect method is triggered
    // every time the user is logged in
    this._watcher = _af.auth.subscribe(res => this._connect(res) );
  }

  ngOnDestroy() {
    // unsubscribe the watcher when the service is destroyed
    this._watcher.unsubscribe();
  }

  public get authenticated(): Observable<any> {
    // verifying if the user is logged in server-side, front-side and if the user object
    // is instancied
    return Observable.create(observer => {
      this._af.auth.subscribe(res => { observer.next(res && !!this._authenticated && !!this.user) });
    }).take(1);
  }

  public get providers() {
    return this._providers;
  }

  public getProviderById(providerId: string) {
    let result = null;

    this._providers.forEach(res => {
      if (providerId == res.id)
        result = res;
    });

    return result;
  }

  public hasProvider(provider: OAuthProvider) {
    let found = false;

    this._providers.forEach(res => {
      if (provider == res)
        found = true;
    });

    return found;
  }

  public isActiveProvider(provider: OAuthProvider) {
    let active = false;

    this._providers.forEach(res => {
      if (provider == res && res.active)
        active = true;
    });

    return active;
  }

  public get user() {
    return this._user;
  }

  
  public changeEmail(email: string) {
    this._auth.updateEmail(email)
      .catch(err => {
        new Error(err).alert();
      });
  }

  public changePassword(password: string) {
    this._auth.updatePassword(password)
      .catch(err => {
        new Error(err).alert();
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
              this._deconnect();
              observer.next();
            });
        });
    });
  }

  public link(provider: OAuthProvider): Observable<any> {
    if (!provider.provider) return;

    return Observable.create(observer => {
      this._auth.linkWithPopup(provider.provider)
        .then(res => {
          this._updateProviders(res.user);
          observer.next(true);
        })
        .catch(err => {
          provider.active = false;
          new Error(err).alert();
          observer.next(false);
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

  public loginWith(provider: OAuthProvider, data?: any): Observable<any> {
    return Observable.create(observer => {
      if (data) {
        this._af.auth.login({
          email: data.email,
          password: data.password
        }, {
          provider: provider.aprovider,
          method: provider.method
        })
          .then(res => {
            observer.next(res);
          })
          .catch(err => {
            new Error(err).alert();
            observer.next(false);
          });
      } else {
        this._af.auth.login({
          provider: provider.aprovider,
          method: provider.method
        })
          .then(res => {
            observer.next(res);
          })
          .catch(err => {
            new Error(err).alert();
            observer.next(false);
          });
      }
    }).take(1);
  }

  public signUp(provider: OAuthProvider, data?: any): Observable<any> {
    return Observable.create(observer => {
      if (data) {
        this._af.auth.createUser({
          email: data.email,
          password: data.password
        })
          .then(res => {
            this._connect(res)
              .subscribe(res => {
                console.log(res);
                observer.next(res);
              });
          })
          .catch(err => {
            new Error(err).alert();
            observer.next(false);
          });
      } else {
        this._af.auth.login({
          provider: provider.aprovider,
          method: provider.method
        })
          .then(res => {
            this._connect(res)
              .subscribe(res => {
                console.log(res);
                observer.next(res);
              });
          })
          .catch(err => {
            new Error(err).alert();
            observer.next(false);
          });
      }
    }).take(1);
  }

  public unlink(provider: OAuthProvider): Observable<any> {
    return Observable.create(observer => {
      if (!provider.active) return;
      provider.active = false;

      this._auth.unlink(provider.id)
        .then(res => {
          this._updateProviders(res);
          observer.next(res);
        })
        .catch(err => {
          provider.active = true;
          new Error(err).alert();
          observer.next(false);
        });
    });
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

  private _connect(params): Observable<any> {
    return Observable.create(observer => {
      if (!params) {
        observer.next(false);
        return;
      }

      let auth = params.auth;
      this._auth = auth;

      this.authenticated.subscribe(res => {
        this._updateProviders(this._auth);

        if (res) {
          observer.next(false);
          return;
        }
        
        this._user = new User(this, this._af.database.object(`/users/${auth.uid}`), auth);

        this._authenticated = true;

        observer.next(true);
      });
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
