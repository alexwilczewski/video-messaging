import React, { Component } from "react";

export class VideoPreview extends Component<IProps, IState> {
  videoRef(element: HTMLVideoElement) {
    element.srcObject = this.props.stream;
  }

  render() {
    return (
      <video
        ref={this.videoRef}
        autoPlay={true}></video>
    );
  }
}

type IProps = {
  stream: MediaStream;
};
type IState = {};
