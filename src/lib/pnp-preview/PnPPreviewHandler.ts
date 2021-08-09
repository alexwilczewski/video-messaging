export class PnPPreviewHandler {
    private _videoPictureInPicture?: HTMLVideoElement;
    private _onLeaveListeners: EventListenerOrEventListenerObject[];

    constructor(request: PnPPreviewHandlerCreateRequest) {
        this._videoPictureInPicture = request.videoPictureInPicture;
        this._onLeaveListeners = [];
    }

    public get hasVideo(): boolean {
        return !!this._videoPictureInPicture;
    }

    public addOnLeave(callback: EventListenerOrEventListenerObject) {
        this._onLeaveListeners.push(callback);
        this._videoPictureInPicture?.addEventListener("leavepictureinpicture", callback);
    }

    public async dispose() {
        this._onLeaveListeners.forEach((cb) => {
            this._videoPictureInPicture?.removeEventListener("leavepictureinpicture", cb);
        });
        this._onLeaveListeners = [];
        if (this._videoPictureInPicture) { this._videoPictureInPicture = undefined; }
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        }
    }
}

export type PnPPreviewHandlerCreateRequest = {
    videoPictureInPicture?: HTMLVideoElement;
};
