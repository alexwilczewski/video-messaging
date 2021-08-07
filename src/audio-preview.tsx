import React, { Component } from "react";

export class AudioPreview extends Component<IProps, IState> {
  render() {
    return (
      <div>{this.props.level}</div>
    );
  }
}

type IProps = {
  level: number;
};
type IState = {};
