import { ScreenHandlerError, ScreenHandler, ScreenHandlerCreateRequest } from "./ScreenHandler";

export class ScreenRequest {
    static async request(): Promise<ScreenHandler> {
        let errorEnum: ScreenHandlerError | undefined;
        let errorException: Error | undefined;
        let isFullscreen: boolean | undefined;
        let stream: MediaStream | undefined;
        let success = false;

        try {
            stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always",
                },
                audio: false,
            });
            isFullscreen = stream
                .getTracks()
                .some((track) => {
                    return track.label.includes("screen");
                });
            // stream.addEventListener("oninactive", () => this.handleScreenTurningOff());
            success = true;
        } catch (ex) {
            errorException = ex;
            if (ex.name.includes("NotAllowedError")) {
                errorEnum = ScreenHandlerError.NotAllowed;
                // console.error("Asking for screen was denied. Likely cancelled.", ex);
            } else {
                errorEnum = ScreenHandlerError.Unknown;
                // console.error("Unknown exception while asking for screen.", ex);
            }
        }

        let createRequest: ScreenHandlerCreateRequest;
        if (success) {
            createRequest = {
                isFullscreen: isFullscreen,
                stream: stream,
            };
        } else {
            createRequest = {
                error: errorEnum,
                errorException: errorException,
            };
        }

        return new ScreenHandler(createRequest);
    }
}
