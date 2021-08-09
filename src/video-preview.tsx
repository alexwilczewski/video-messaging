import React, { Component } from "react";

export class VideoPreview extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.videoRef = this.videoRef.bind(this);
  }

  videoRef(element: HTMLVideoElement) {
    if (element) {
      element.srcObject = this.props.stream;
    }
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
