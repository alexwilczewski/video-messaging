import React, { Component } from "react";
import { FontawesomeCheck } from "./fontawesome-check";

export class RecordSelection extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.audioToggle = this.audioToggle.bind(this);
    this.cameraToggle = this.cameraToggle.bind(this);
    this.screenToggle = this.screenToggle.bind(this);
  }

  audioToggle() {
    this.emitRequest({
      audio: !this.props.audio,
      camera: this.props.camera,
      screen: this.props.screen,
    });
  }

  cameraToggle() {
    this.emitRequest({
      audio: this.props.audio,
      camera: !this.props.camera,
      screen: this.props.screen,
    });
  }

  screenToggle() {
    this.emitRequest({
      audio: this.props.audio,
      camera: this.props.camera,
      screen: !this.props.screen,
    });
  }

  emitRequest(request: SelectionChangeRequest) {
    this.props.onSelectionChange(request);
  }

  render() {
    const cameraClasses = [
      "btn btn-lg px-4 mx-1",
      (this.props.camera ? "btn-secondary" : "btn-outline-secondary"),
    ];
    const audioClasses = [
      "btn btn-lg px-4 mx-1",
      (this.props.audio ? "btn-secondary" : "btn-outline-secondary"),];
    const screenClasses = [
      "btn btn-lg px-4 mx-1",
      (this.props.screen ? "btn-secondary" : "btn-outline-secondary"),];

    return (
      <div>
        <button
          type="button"
          className={cameraClasses.join(" ")}
          onClick={this.cameraToggle}
        >
          <FontawesomeCheck className="me-1"
            on={this.props.camera} />Camera
        </button>

        <button
          type="button"
          className={audioClasses.join(" ")}
          onClick={this.audioToggle}
        >
          <FontawesomeCheck className="me-1"
            on={this.props.audio} />Audio
        </button>

        <button
          type="button"
          className={screenClasses.join(" ")}
          onClick={this.screenToggle}
        >
          <FontawesomeCheck className="me-1"
            on={this.props.screen} />Screen
        </button>
      </div>
    );
  }
}

type IProps = {
  audio: boolean;
  camera: boolean;
  onSelectionChange: OnSelectionChangeCallback;
  screen: boolean;
};
type IState = {};

type OnSelectionChangeCallback = (request: SelectionChangeRequest) => void;
type SelectionChangeRequest = {
  audio: boolean;
  camera: boolean;
  screen: boolean;
};
