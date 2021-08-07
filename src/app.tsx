import React, { Component } from "react";
import { SelectionWrapper } from "./selection-wrapper";

export class App extends Component {
  render() {
    return (
      <div className="px-4 py-5 my-5 text-center">
        <h1 className="display-5 fw-bold mb-4">VidShare</h1>

        <div className="col-lg-6 mx-auto">
          <SelectionWrapper></SelectionWrapper>
        </div>
      </div>
    );
  }
}
