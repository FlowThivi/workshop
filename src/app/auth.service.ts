import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { AngularFire } from 'angularfire2';
import { User } from './user';
import { OAUTH_PROVIDERS } from './shared/oauth.config';
import { OAuthProvider } from './o-auth-provider';

@Injectable()
export class AuthService implements OnDestroy {

  // utilisateur courant
  private _user: User;

  // indication de connexion
  private _authenticated: boolean;

  private _watcher;

  private _providers: Array<OAuthProvider> = [];

  constructor(private _af: AngularFire) {
    for (let providerId of OAUTH_PROVIDERS)
      this._providers.push(new OAuthProvider(providerId));

    this._watcher = _af.auth.subscribe(res => this._connect(res));
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }

  public get providers() {
    return this._providers;
  }

  public get authenticated(): Observable<boolean> {
    return Observable.create(observer => {
      this._af.auth.subscribe(res => { observer.next(res && !!this._authenticated && !!this.user) });
    }).take(1);
  }

  public get user() {
    return this._user;
  }

  public changeEmail(email: string) {
    this._af.auth
      .subscribe(res => {
        res.auth.updateEmail(email);
      });
  }

  public loginWith(provider: OAuthProvider): Observable<any> {
    let params = {
      provider: provider.aprovider
    };

    return this._login(params);
  }

  public logout(): Observable<any> {
    return Observable.create(observer => {
      this._deconnect();

      this._af.auth.logout();

      observer.next();
    }).take(1);
  }

  public deleteAccount(): Observable<any> {
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
      this._af.auth
        .subscribe(res => {
          res.auth.linkWithPopup(provider.provider)
            .then(res => {
              this._updateProviders(res.user);
              observer.next(true);
            })
            .catch(err => {
              this._getError(err);
              observer.next(false);
            });
        });
    }).take(1);
    
  }

  public unlink(provider: OAuthProvider): Observable<any> {
    return Observable.create(observer => {
      this._af.auth.subscribe(res => {
        res.auth.unlink(provider.id)
          .then(res => {
            this._updateProviders(res);
            observer.next(true);
          })
          .catch(err => {
            this._getError(err);
            observer.next(false);
          });
      });
    }).take(1);
  }

  private _login(params): Observable<any> {
    return Observable.create(observer => {
      this._af.auth.login(params)
        .then(res => {
          observer.next(true);
        })
        .catch(err => {
          this._getError(err);
          observer.next(false);
        });
    });

  }

  private _getError(error) {
    this.authenticated.subscribe(res => { if (res) this.logout() });

    console.log(error);

    /*setTimeout(() => {
      switch(error.code) {
        case 'auth/popup-closed-by-user':
          this.loaders.link.stop();
          alert(`Veuillez ne pas fermer la fenetre de connexion.`);
          break;
        case 'auth/account-exists-with-different-credential':
          this.loaders.connect.stop();
          alert(`Ce moyen de connexion n'est pas configuré avec l'adresse ${error.email}. Pour des raisons de sécurité, utilisez un autre moyen de connexion et rendez vous dans vos paramètres de sécurité pour configurer celui-ci.`);
          break;
        case 'auth/credential-already-in-use':
          this.loaders.link.stop();
          alert(`Ce moyen de connexion est déjà utilisé.`);
          break;
        case 'auth/email-already-in-use':
          this.loaders.link.stop();
          alert(`Cette adresse mail est déjà associé à un compte.`);
          break;
        case 'auth/provider-already-linked':
          this.loaders.link.stop();
          alert(`Ce moyen de connexion est déjà associé à un compte.`);
          break;
        default:
          console.log(error);
          break;
      }
    });*/
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
