import React, { Component } from "react";
import { RecordHandler } from "./lib/record/RecordHandler";
import { RecordRequest } from "./lib/record/RecordRequest";
import { OnStartRecordingRequest, SelectionWrapper } from "./selection-wrapper";

export class App extends Component<IProps, IState> {
    private recordHandler?: RecordHandler;

    constructor(props: any) {
        super(props);

        this.state = {};

        this.onRecording = this.onRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
    }

    onRecording(request: OnStartRecordingRequest) {
        this.recordHandler = RecordRequest.build({
            previewHandler: request.previewHandler,
            screenHandler: request.screenHandler,
        });
        this.recordHandler.startRecording();
    }

    async stopRecording() {
        const blob = await this.recordHandler?.stopRecording();
        debugger;
        this.setState({
            downloadHref: URL.createObjectURL(blob),
        });
    }

    render() {
        return (
            <div className="px-4 py-5 my-5 text-center">
                <h1 className="display-5 fw-bold mb-4">VidShare</h1>

                <div className="col-lg-6 mx-auto">
                    <SelectionWrapper onStartRecording={this.onRecording}></SelectionWrapper>
                    <button onClick={this.stopRecording}>Stop recording</button>
                    <a href={this.state.downloadHref}
                        download="test.webm">Download</a>
                </div>
            </div>
        );
    }
}

type IProps = {};
type IState = {
    downloadHref?: string;
};
