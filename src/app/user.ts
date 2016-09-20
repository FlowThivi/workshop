import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseObjectObservable } from 'angularfire2';
import { AuthService } from './auth.service';

import { OAuthProvider } from './o-auth-provider';

export class User implements OnDestroy {
  private _uid: string;
  private _email: string;
  private _firstname: string;
  private _lastname: string;
  private _pic: any;

  private _watcher;
  private _loaded: boolean = false;

  constructor(private _auth: AuthService, private _fb: FirebaseObjectObservable<any>, public user: any) {
    this.update(user);

    this._watcher = this._fb
      .subscribe(data => {
        this._loaded = true;

        this._firstname = data.firstname;
        this._lastname = data.lastname;
      });
  }

  public get uid() {
    return this._uid;
  }

  public get email() {
    return this._email;
  }

  public set email(email: string) {
    if (this._email == email) return;
    this._auth.changeEmail(email);
    this._email = email;
  }

  public get firstname() {
    return this._firstname;
  }

  public set firstname(firstname: string) {
    if (this._firstname == firstname) return;
    this._fb.update({firstname: firstname});
  }

  public get lastname() {
    return this._lastname;
  }

  public set lastname(lastname: string) {
    if (this._lastname == lastname) return;
    this._fb.update({lastname: lastname});
  }

  public get loaded() {
    return this._loaded;
  }

  public get pic() {
    return this._pic;
  }

  public set pic(picture: File) {
    let ref = `pics/${this._uid}`;

    this._pic = 0;

    firebase.storage().ref().child(ref).put(picture)
      .then(snapshot => {
        firebase.storage().ref(ref).getDownloadURL()
          .then(url => {
            setTimeout(() => {
              this._pic = url;
            });
          });
      });
  }

  public toString() {
    return this.loaded && (this.firstname || this.lastname) ? `${this.firstname} ${this.lastname}` : this.email ? this.email : this.uid;
  }

  public update(user) {
    if (!user) return;

    this._uid = user.uid;
    this._email = user.email;

    firebase.storage().ref(`pics/${this._uid}`).getDownloadURL()
      .then(url => {
        setTimeout(() => {
          this._pic = url;
        });
      });
  }

  public delete(): Observable<any> {
    return Observable.create(observer => {
      this._auth.deleteAccount()
        .subscribe(res => observer.next());
    });
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }
}
