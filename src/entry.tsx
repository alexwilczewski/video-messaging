import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

ReactDOM.render(
  <App />,
  document.getElementById("root")
);

declare global {
  interface MediaDevices {
    getDisplayMedia(constraints?: GetDisplayMediaConstraints): Promise<MediaStream>;
  }

  interface GetDisplayMediaConstraints extends MediaStreamConstraints {
    video?: VideoDisplayMediaTrackConstraints;
  }

  interface VideoDisplayMediaTrackConstraints extends MediaTrackConstraints {
    cursor?: string;
  }

  interface HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
  }

  interface Document {
    exitPictureInPicture: () => Promise<void>;
    pictureInPictureElement?: HTMLVideoElement;
  }

  interface HTMLVideoElement {
    autoplay?: "autoplay" | boolean;
    requestPictureInPicture: () => void;
  }
}
