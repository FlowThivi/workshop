import { AuthProviders, AuthMethods } from 'angularfire2';

export class OAuthProvider {
    private _id: string;
    private _name: string;
    private _provider;
    private _aprovider;
    private _method;

    private _active: boolean = false;
    private _email: string;

    constructor(providerId: string) {
        switch(providerId) {
            case 'password':
                this._initPassword();
                break;
            case 'facebook.com':
                this._initFacebook();
                break;
            case 'google.com':
                this._initGoogle();
                break;
            case 'github.com':
                this._initGithub();
                break;
            case 'twitter.com':
                this._initTwitter();
                break;
        }
    }

    public get id() {
        return this._id;
    }

    public get active() {
        return !!this._active;
    }

    public set active(value: boolean) {
        this._active = value;
    }

    public get name() {
        return this._name;
    }

    public get provider() {
        return this._provider;
    }

    public get aprovider() {
        return this._aprovider;
    }

    public get email() {
        return this._email;
    }

    public set email(email: string) {
        this._email = email;
    }

    public get method() {
        return this._method;
    }

    private _initPassword() {
        this._id = 'password';
        this._aprovider = AuthProviders.Password;
        this._method = AuthMethods.Password;
    }

    private _initFacebook() {
        this._id = 'facebook.com';
        this._name = 'Facebook';
        this._provider = new firebase.auth.FacebookAuthProvider();
        this._aprovider = AuthProviders.Facebook;
        this._method = AuthMethods.Popup;
    }

    private _initGoogle() {
        this._id = 'google.com';
        this._name = 'Google';
        this._provider = new firebase.auth.GoogleAuthProvider();
        this._aprovider = AuthProviders.Google;
        this._method = AuthMethods.Popup;
    }

    private _initGithub() {
        this._id = 'github.com';
        this._name = 'Github';
        this._provider = new firebase.auth.GithubAuthProvider();
        this._aprovider = AuthProviders.Github;
        this._method = AuthMethods.Popup;
    }

    private _initTwitter() {
        this._id = 'twitter.com';
        this._name = 'Twitter';
        this._provider = new firebase.auth.TwitterAuthProvider();
        this._aprovider = AuthProviders.Twitter;
        this._method = AuthMethods.Popup;
    }
}
