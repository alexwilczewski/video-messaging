export class PreviewHandler {
    private _canvas?: HTMLCanvasElement;
    private _compositeStream?: MediaStream;
    private _stream?: MediaStream;
    private _videoCamera?: HTMLVideoElement;
    private _videoScreen?: HTMLVideoElement;

    constructor(request: PreviewHandlerCreateRequest) {
        this._canvas = request.canvas;
        this._compositeStream = request.compositeStream;
        this._stream = request.stream;
        this._videoCamera = request.videoCamera;
        this._videoScreen = request.videoScreen;
        this.drawCanvasIfNecessary();
    }

    public get hasStream(): boolean {
        return !!this._stream;
    }

    public get stream(): MediaStream {
        if (!this._stream) { throw new Error("Stream must be defined"); }
        return this._stream;
    }

    public dispose() {
        if (this._canvas) { this._canvas = undefined; }
        if (!!this._compositeStream) {
            this._compositeStream?.getTracks().forEach((o) => o.stop());
            this._compositeStream = undefined;
        }
        if (this._videoCamera) { this._videoCamera = undefined; }
        if (this._videoScreen) { this._videoScreen = undefined; }
    }

    private drawCanvasIfNecessary() {
        if (this._canvas
            && this._videoCamera
            && this._videoScreen) {
            const ctx = this._canvas.getContext("2d");
            ctx?.drawImage(this._videoScreen, 0, 0, 500, 400);
            ctx?.drawImage(this._videoCamera, 400, 400, 100, 100);
            requestAnimationFrame(() => this.drawCanvasIfNecessary);
        }
    }
}

export type PreviewHandlerCreateRequest = {
    canvas?: HTMLCanvasElement;
    compositeStream?: MediaStream;
    stream?: MediaStream;
    videoCamera?: HTMLVideoElement;
    videoScreen?: HTMLVideoElement;
};
