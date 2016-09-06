export class User {
  private _uid: string;
  private _email: string;
  //private _groups: Array<any>;

  constructor(auth) {
    this._uid = auth.uid;
  }

  get uid() {
    return this._uid;
  }

  get email() {
    return this._email;
  }
}
