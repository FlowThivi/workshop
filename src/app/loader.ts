export class Loader {
    private _load: boolean;

    constructor() {
        this._load = false;
    }

    public get load() {
        return !!this._load;
    }

    public start() {
        this._load = true;
        return this;
    }

    public stop() {
        this._load = false;
        return this;
    }

    public toString() {
        return !!this._load;
    }
}
