import React, { Component } from "react";
import { AudioPreview } from "./audio-preview";
import { VideoPreview } from "./video-preview";

export class SelectionPreview extends Component<IProps, IState> {
    render() {
        const videoPreview = (this.props.videoStream
            ? <VideoPreview stream={this.props.videoStream}></VideoPreview>
            : <></>
        );
        const audioPreview = (this.props.showAudio
            ? <AudioPreview level={this.props.audioLevel}></AudioPreview>
            : <></>
        );

        return (
            <div>{videoPreview}{audioPreview}</div>
        );
    }
}

type IProps = {
    audioLevel: number;
    showAudio: boolean;
    videoStream?: MediaStream;
};
type IState = {};
