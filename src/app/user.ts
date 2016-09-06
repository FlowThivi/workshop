import { FirebaseObjectObservable } from 'angularfire2';

export class User {
  private _uid: string;
  private _email: string;
  //private _groups: Array<any>;
  private _firstname;
  private _lastname;

  constructor(auth: any, private _fb: FirebaseObjectObservable<any> ) {
    this._uid = auth.uid;

    this._fb
      .subscribe(data => {
        this._firstname = data.firstname;
      });
  }

  public get uid() {
    return this._uid;
  }

  public get email() {
    return this._email;
  }

  public get firstname() {
    return this._firstname;
  }

  public set firstname(firstname: string) {
    this._fb.set({firstname: firstname});
  }

  public get lastname() {
    return this._lastname;
  }

  public set lastname(lastname: string) {
    this._fb.set({lastname: lastname});
  }
}
