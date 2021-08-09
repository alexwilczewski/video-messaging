export class ScreenHandler {
    private _error?: ScreenHandlerError;
    private _errorException?: Error;
    private _isFullscreen?: boolean;
    private _stream?: MediaStream;
    private _onCloseListeners: EventListenerOrEventListenerObject[];

    constructor(request: ScreenHandlerCreateRequest) {
        this._error = request.error;
        this._errorException = request.errorException;
        this._isFullscreen = request.isFullscreen;
        this._stream = request.stream;
        this._onCloseListeners = [];
    }

    public get error(): ScreenHandlerError {
        if (!this._error) { throw new Error("Error must be defined"); }
        return this._error;
    }

    public get errorException(): Error {
        if (!this._errorException) { throw new Error("ErrorException must be defined"); }
        return this._errorException;
    }

    public get isFullscreen(): boolean {
        return !!this._isFullscreen;
    }

    public get hasStream(): boolean {
        return !!this._stream;
    }

    public get stream(): MediaStream {
        if (!this._stream) { throw new Error("Stream must be defined"); }
        return this._stream;
    }

    public addOnClose(callback: EventListenerOrEventListenerObject) {
        this._onCloseListeners.push(callback);
        this.stream.addEventListener("inactive", callback);
    }

    public dispose() {
        if (this.hasStream) {
            this._onCloseListeners.forEach((cb) => {
                this.stream.removeEventListener("inactive", cb);
            });
            this._onCloseListeners = [];
            this.stream.getTracks().forEach((o) => o.stop());
            this._stream = undefined;
        }
    }
}

export type ScreenHandlerCreateRequest = {
    error?: ScreenHandlerError;
    errorException?: Error;
    isFullscreen?: boolean;
    stream?: MediaStream;
};

export enum ScreenHandlerError {
    None = 0,
    NotAllowed,
    Unknown,
};
