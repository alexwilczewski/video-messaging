export class RecordHandler {
    private _recorder?: MediaRecorder;
    private _blobChunks?: Blob[];
    private _stopRecordingResolver?: (value: Blob | PromiseLike<Blob>) => void;

    constructor(request: RecordHandlerCreateRequest) {
        this._recorder = this.buildRecorder(request);
    }

    startRecording() {
        this._blobChunks = [];
        this._recorder?.addEventListener("dataavailable", (e) => this.onDataAvailable(e));
        this._recorder?.addEventListener("stop", () => this.onStop());
        this._recorder?.start(250);
    }

    async stopRecording(): Promise<Blob> {
        return new Promise<Blob>((resolve) => {
            this._stopRecordingResolver = resolve;
            this._recorder?.stop();
        });
    }

    private onDataAvailable(e: BlobEvent) {
        this._blobChunks?.push(e.data);
    }

    private onStop() {
        if (this._stopRecordingResolver) {
            const constructedBlob = new Blob(this._blobChunks, {
                type: "video/webm",
            });
            this._stopRecordingResolver(constructedBlob);
        }
    }

    private buildRecorder(request: RecordHandlerCreateRequest): MediaRecorder {
        const tracks = request.tracks;
        const stream = new MediaStream(tracks);
        const response = new MediaRecorder(stream, {
            mimeType: "video/webm",
        });
        return response;
    }
}

export type RecordHandlerCreateRequest = {
    tracks: MediaStreamTrack[];
};
