export class Error {
    private _code: string;
    private _message: string;

    constructor(error: any) {
        this._code = error.code;
        this._message = this._translate(error.code) || error.message;
    }

    public alert() {
        alert(this._message);
    }

    private _translate(code: string) {
        let message: string;

        switch(code) {
            case 'auth/popup-closed-by-user':
                message = `Veuillez ne pas fermer la fenetre de connexion.`;
                break;
            case 'auth/network-request-failed':
                message = `Une erreur est survenue. Vérifiez votre connexion internet`;
                break;
            case 'auth/account-exists-with-different-credential':
                message = `Ce moyen de connexion n'est pas configuré avec cette adresse mail. Pour des raisons de sécurité, utilisez un autre moyen de connexion et rendez vous dans vos paramètres de sécurité pour configurer celui-ci.`;
                break;
            case 'auth/credential-already-in-use':
                message = `Ce moyen de connexion est déjà utilisé.`;
                break;
            case 'auth/email-already-in-use':
                message = `Cette adresse mail est déjà associé à un compte.`;
                break;
            case 'auth/provider-already-linked':
                message = `Ce moyen de connexion est déjà associé à un compte.`;
                break;
            default:
                console.log(code);
                break;
        }

        return message;
    }
    
}
