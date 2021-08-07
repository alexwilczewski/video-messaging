import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export class FontawesomeCheck extends Component<IProps, IState> {
  render() {
    const iconSet: IconProp = (this.props.on
      ? ["fas", "check-circle"]
      : ["far", "check-circle"]);
    return (
      <FontAwesomeIcon className={this.props.className}
        icon={iconSet}></FontAwesomeIcon>
    );
  }
}

interface IProps {
  className?: string;
  on: boolean;
};
type IState = {};
