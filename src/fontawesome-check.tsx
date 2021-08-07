import React, { Component } from "react";

export class FontawesomeCheck extends Component<IProps, IState> {
  render() {
    const iconSet = (this.props.on
      ? ["fas", "check-circle"]
      : ["far", "check-circle"]);
    return (
      <div className={this.props.className}>{iconSet}</div>
    );
  }
}

interface IProps {
  className?: string;
  on: boolean;
};
type IState = {};
