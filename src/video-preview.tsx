import React, { Component, RefObject } from "react";

export class VideoPreview extends Component<IProps, IState> {
  private videoRef: RefObject<HTMLVideoElement>;

  constructor(props: IProps) {
    super(props);

    this.videoRef = React.createRef<HTMLVideoElement>();
  }

  componentDidUpdate() {
    if (this.videoRef.current) {
      this.videoRef.current.srcObject = this.props.stream;
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
