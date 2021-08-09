import { CameraHandler, CameraHandlerCreateRequest } from "./CameraHandler";
import { CameraHandlerError } from "./CameraHandlerError";

export class CameraRequest {
    static async request(): Promise<CameraHandler> {
        let errorEnum: CameraHandlerError | undefined;
        let errorException: Error | undefined;
        let stream: MediaStream | undefined;
        let success = false;

        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
            success = true;
        } catch (ex) {
            errorException = ex;
            if (ex.name.includes("NotAllowedError")) {
                errorEnum = CameraHandlerError.NotAllowed;
            } else if (ex.name.includes("NotFoundError")) {
                errorEnum = CameraHandlerError.NotFound;
            } else {
                errorEnum = CameraHandlerError.Unknown;
            }
        }

        let createRequest: CameraHandlerCreateRequest;
        if (success) {
            createRequest = {
                stream: stream,
            };
        } else {
            createRequest = {
                error: errorEnum,
                errorException: errorException,
            };
        }

        return new CameraHandler(createRequest);
    }
}
