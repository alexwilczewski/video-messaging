import { PreviewHandler } from "../preview/PreviewHandler";
import { ScreenHandler } from "../screen/ScreenHandler";
import { RecordHandler } from "./RecordHandler";

export class RecordRequest {
    static build(request: StartRequest): RecordHandler {
        const previewHandler = request.previewHandler;
        const screenHandler = request.screenHandler;

        let tracks: MediaStreamTrack[] = [];

        if (previewHandler
            && previewHandler.isStreamComposite) {
            tracks.push(...previewHandler.stream.getTracks());
        } else if (screenHandler
            && screenHandler.hasStream
            && screenHandler.isFullscreen) {
            tracks.push(...screenHandler.stream.getTracks());
        } else if (previewHandler
            && previewHandler.hasStream) {
            tracks.push(...previewHandler.stream.getTracks());
        }

        return new RecordHandler({
            tracks: tracks,
        });
    }
}

export type StartRequest = {
    previewHandler?: PreviewHandler;
    screenHandler?: ScreenHandler;
};
