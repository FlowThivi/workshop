import { OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseObjectObservable } from 'angularfire2';
import { AuthService } from './auth.service';
import { Error } from './error';

import { OAuthProvider } from './o-auth-provider';

export class User implements OnDestroy {
  private _uid: string;
  private _email: string;
  private _firstname: string;
  private _lastname: string;
  private _pic: string | number;

  private _watcher;
  private _loaded: boolean = false;

  constructor(private _auth: AuthService, private _fb: FirebaseObjectObservable<any>, public user: any) {
    this.update(user)
      .subscribe();

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

  public set password(password: string) {
    this._auth.changePassword(password);
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

  public setPic(picture: Blob): Observable<any> {
    let ref = `pics/${this._uid}`;

    this._pic = -1;

    return Observable.create(observer => {
      let upload = firebase.storage().ref().child(ref).put(picture);

      upload.on('state_changed', snapshot => {
        console.log(snapshot.bytesTransferred / snapshot.totalBytes);
      });

      upload
        .then(snapshot => {
          this._updatePic()
            .subscribe(() => observer.next());
        })
        .catch(error => new Error(error).alert());
    });
  }

  public toString() {
    return this.loaded && (this.firstname || this.lastname) ? `${this.firstname} ${this.lastname}` : this.email ? this.email : this.uid;
  }

  public update(user): Observable<any> {
    if (!user) return;

    return Observable.create(observer => {
      this._uid = user.uid;
      this._email = user.email;

      this._updatePic()
        .subscribe(() => observer.next());
    });
  }

  public delete(): Observable<any> {
    return Observable.create(observer => {
      this._auth.deleteAccount()
        .subscribe(res => observer.next());
    });
  }

  private _updatePic(): Observable<any> {
    return Observable.create(observer => {
      firebase.storage().ref(`pics/${this._uid}`).getDownloadURL()
        .then(url => {
          this._pic = -1;
          setTimeout(() => {
            let img = new Image();
            img.src = url;
            img.onload = () => {
              this._pic = url;
              observer.next();
            }
          });
        })
        .catch(error => new Error(error).alert());
    });
  }

  ngOnDestroy() {
    this._watcher.unsubscribe();
  }
}
