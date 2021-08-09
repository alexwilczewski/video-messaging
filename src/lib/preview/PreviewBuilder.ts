import { PreviewHandler } from "./PreviewHandler";

export class PreviewBuilder {
    static build(request: BuildRequest): PreviewHandler {
        const cameraStream = request.cameraStream;
        const screenStream = request.screenStream;
        const screenFullscreen = request.screenFullscreen;

        let canvas: HTMLCanvasElement | undefined;
        let compositeStream: MediaStream | undefined;
        let stream: MediaStream | undefined;
        let videoCamera: HTMLVideoElement | undefined;
        let videoScreen: HTMLVideoElement | undefined;

        if (screenStream
            && screenFullscreen) {
            stream = screenStream;
        } else if (
            !cameraStream &&
            screenStream &&
            !screenFullscreen
        ) {
            stream = screenStream;
        } else if (
            cameraStream &&
            screenStream &&
            !screenFullscreen
        ) {
            videoCamera = document.createElement("video");
            videoCamera.autoplay = true;
            videoCamera.height = 100;
            videoCamera.width = 100;
            videoCamera.srcObject = cameraStream;

            videoScreen = document.createElement("video");
            videoScreen.autoplay = true;
            videoScreen.height = 400;
            videoScreen.width = 500;
            videoScreen.srcObject = screenStream;

            canvas = document.createElement("canvas");
            canvas.height = 500;
            canvas.width = 500;
            stream = canvas.captureStream();
            compositeStream = stream;
        } else if (cameraStream && !screenStream) {
            stream = cameraStream;
        }

        return new PreviewHandler({
            canvas: canvas,
            compositeStream: compositeStream,
            stream: stream,
            videoCamera: videoCamera,
            videoScreen: videoScreen,
        });
    }
}

export type BuildRequest = {
    cameraStream?: MediaStream;
    screenStream?: MediaStream;
    screenFullscreen?: boolean;
};
