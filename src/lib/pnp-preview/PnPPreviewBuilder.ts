import { CameraHandler } from "../camera/CameraHandler";
import { ScreenHandler } from "../Screen/ScreenHandler";
import { PnPPreviewHandler } from "./PnPPreviewHandler";

export class PnPPreviewBuilder {
    static build(request: BuildRequest): PnPPreviewHandler {
        const cameraHandler = request.cameraHandler;
        const screenHandler = request.screenHandler;

        let videoPictureInPicture: HTMLVideoElement | undefined;

        if (
            cameraHandler &&
            screenHandler &&
            screenHandler.isFullscreen
        ) {
            videoPictureInPicture = document.createElement("video");
            videoPictureInPicture.autoplay = true;
            videoPictureInPicture.srcObject = cameraHandler.stream;
            videoPictureInPicture.addEventListener("loadedmetadata", () => {
                videoPictureInPicture?.requestPictureInPicture();
            });
        }

        return new PnPPreviewHandler({
            videoPictureInPicture: videoPictureInPicture,
        });
    }
}

export type BuildRequest = {
    cameraHandler?: CameraHandler;
    screenHandler?: ScreenHandler;
};
