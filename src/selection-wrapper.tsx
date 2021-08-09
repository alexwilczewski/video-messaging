import React, { Component } from "react";
import { ScreenRequest } from "./lib/screen/ScreenRequest";
import { ScreenHandler } from "./lib/screen/ScreenHandler";
import { RecordSelection } from "./record-selection";
import { SelectionPreview } from "./selection-preview";
import { ScreenHandlerError } from "./lib/screen/ScreenHandlerError";
import { CameraHandler } from "./lib/camera/CameraHandler";
import { CameraRequest } from "./lib/camera/CameraRequest";
import { CameraHandlerError } from "./lib/camera/CameraHandlerError";
import { PreviewBuilder } from "./lib/preview/PreviewBuilder";
import { PreviewHandler } from "./lib/preview/PreviewHandler";
import { PnPPreviewBuilder } from "./lib/pnp-preview/PnPPreviewBuilder";
import { PnPPreviewHandler } from "./lib/pnp-preview/PnPPreviewHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type SelectionRequestRequest = {
    audio: Boolean;
    camera: Boolean;
    screen: Boolean;
};

export class SelectionWrapper extends Component<IProps, IState> {
    static HIGH_AUDIO_LEVEL = 10000;
    private audioPreviewCapture: {
        analyser?: AnalyserNode,
        inputs?: Uint8Array,
        max: number,
    } = {
            analyser: undefined,
            inputs: undefined,
            max: 4,
        };
    private cameraHandler?: CameraHandler;
    private pnpPreviewHandler?: PnPPreviewHandler;
    private previewHandler?: PreviewHandler;
    private screenHandler?: ScreenHandler;

    constructor(props: IProps) {
        super(props);

        this.state = {
            audio: {
                level: 0,
                stream: undefined,
            },
            enabled: {
                audio: false,
                camera: false,
                screen: false,
            },
        };

        this.recordClicked = this.recordClicked.bind(this);
        this.selectionRequest = this.selectionRequest.bind(this);
    }

    async componentDidMount() {
        await this.selectionRequest({
            audio: false,
            camera: false,
            screen: false,
        });
    }

    async componentDidUpdate(prevProps: IProps, prevState: IState) {
        if (!prevState.enabled.audio && this.state.enabled.audio) {
            // Audio was enabled!
            try {
                this.handleCaptureAudioLevel();
            } catch (ex) {
                console.error("Unable to capture audio levels.", ex);
            }
        }
    }

    async selectionRequest(request: SelectionRequestRequest) {
        await this.handleSelectionRequestForAudio(request);
        await this.handleSelectionRequestForCamera(request);
        await this.handleSelectionRequestForScreen(request);
    }

    async handleSelectionRequestForAudio(request: SelectionRequestRequest) {
        if (this.state.enabled.audio && request.audio) {
        } else if (this.state.enabled.audio && !request.audio) {
            this.handleAudioTurningOff();
        } else if (!this.state.enabled.audio && request.audio) {
            await this.handleAudioTurningOn();
        } else if (!this.state.enabled.audio && !request.audio) {
        }
    }
    handleAudioTurningOff() {
        if (this.state.audio.stream) {
            this.state.audio.stream.getTracks().forEach((o) => o.stop());
        }
        this.setState({
            audio: {
                ...this.state.audio,
                level: 0,
                stream: undefined,
            },
            enabled: {
                ...this.state.enabled,
                audio: false,
            },
        });
    }
    async handleAudioTurningOn() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true,
            });
            stream.addEventListener("inactive", () => this.handleAudioTurningOff());
            this.setState({
                audio: {
                    ...this.state.audio,
                    stream: stream,
                },
                enabled: {
                    ...this.state.enabled,
                    audio: true,
                },
            });
        } catch (ex) {
            this.setState({
                audio: {
                    ...this.state.audio,
                    stream: undefined,
                },
                enabled: {
                    ...this.state.enabled,
                    audio: false,
                },
            });
            console.error(
                "Unable to turn on audio. Check to see if audio sharing is allowed.",
                ex
            );
        }
    }
    handleCaptureAudioLevel() {
        if (this.state.audio.stream) {
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            this.audioPreviewCapture.inputs = new Uint8Array(bufferLength);

            const source = audioContext.createMediaStreamSource(this.state.audio.stream);
            source.connect(analyser);

            this.audioPreviewCapture.analyser = analyser;

            this.updateAudioLevel();
        }
    }
    updateAudioLevel() {
        if (this.audioPreviewCapture.analyser
            && this.audioPreviewCapture.inputs) {
            this.audioPreviewCapture.analyser?.getByteFrequencyData(this.audioPreviewCapture.inputs);
            var sum = this.audioPreviewCapture.inputs?.reduce((x, n) => x + n) ?? 0;
            var left = Math.min(1, sum / SelectionWrapper.HIGH_AUDIO_LEVEL);
            this.setState({
                audio: {
                    ...this.state.audio,
                    level: Math.round(left * this.audioPreviewCapture.max),
                },
            });
            requestAnimationFrame(() => this.updateAudioLevel());
        }
    }

    async handleSelectionRequestForCamera(request: SelectionRequestRequest) {
        if (this.state.enabled.camera && request.camera) {
        } else if (this.state.enabled.camera && !request.camera) {
            this.handleCameraTurningOff();
        } else if (!this.state.enabled.camera && request.camera) {
            await this.handleCameraTurningOn();
        } else if (!this.state.enabled.camera && !request.camera) {
        }
    }
    handleCameraTurningOff() {
        if (this.cameraHandler) {
            this.cameraHandler.dispose();
            this.cameraHandler = undefined;
        }
        this.handleVideoChange();
        this.setState({
            enabled: {
                ...this.state.enabled,
                camera: false,
            },
        });
    }
    async handleCameraTurningOn() {
        const handler = await CameraRequest.request();
        if (handler.hasStream) {
            handler.addOnClose(() => this.handleCameraTurningOff());
            this.cameraHandler = handler;
            this.handleVideoChange();
            this.setState({
                enabled: {
                    ...this.state.enabled,
                    camera: true,
                },
            });
        } else {
            const ex = handler.errorException;
            if (handler.error === CameraHandlerError.NotAllowed) {
                console.error("Asking for camera was denied. Check camera permissions.", ex);
            } else if (handler.error === CameraHandlerError.NotFound) {
                console.error("No camera found. Does laptop button need to be toggled?", ex);
            } else {
                console.error("Unknown exception while asking for camera.", ex);
            }
        }
    }

    async handleSelectionRequestForScreen(request: SelectionRequestRequest) {
        if (this.state.enabled.screen && request.screen) {
        } else if (this.state.enabled.screen && !request.screen) {
            this.handleScreenTurningOff();
        } else if (!this.state.enabled.screen && request.screen) {
            await this.handleScreenTurningOn();
        } else if (!this.state.enabled.screen && !request.screen) {
        }
    }
    handleScreenTurningOff() {
        if (this.screenHandler) {
            this.screenHandler.dispose();
            this.screenHandler = undefined;
        }
        this.handleVideoChange();
        this.setState({
            enabled: {
                ...this.state.enabled,
                screen: false,
            },
        });
    }
    async handleScreenTurningOn() {
        const handler = await ScreenRequest.request();
        if (handler.hasStream) {
            handler.addOnClose(() => this.handleScreenTurningOff());
            this.screenHandler = handler;
            this.handleVideoChange();
            this.setState({
                enabled: {
                    ...this.state.enabled,
                    screen: true,
                },
            });
        } else {
            const ex = handler.errorException;
            if (handler.error === ScreenHandlerError.NotAllowed) {
                console.error("Asking for screen was denied. Likely cancelled.", ex);
            } else {
                console.error("Unknown exception while asking for screen.", ex);
            }
        }
    }

    async handleVideoChange() {
        this.buildPreviewStream();
        await this.buildPictureInPicturePreviewStream();
    }
    buildPreviewStream() {
        if (this.previewHandler) {
            this.previewHandler.dispose();
            this.previewHandler = undefined;
        }

        const handler = PreviewBuilder.build({
            cameraStream: this.cameraHandler?.stream,
            screenFullscreen: this.screenHandler?.isFullscreen,
            screenStream: this.screenHandler?.stream,
        });
        let previewStream: MediaStream | undefined;
        if (handler.hasStream) {
            this.previewHandler = handler;
            previewStream = handler.stream;
        }
        this.setState({
            previewStream: previewStream,
        });
    }
    async buildPictureInPicturePreviewStream() {
        if (this.pnpPreviewHandler) {
            await this.pnpPreviewHandler.dispose();
            this.pnpPreviewHandler = undefined;
        }

        const handler = PnPPreviewBuilder.build({
            cameraHandler: this.cameraHandler,
            screenHandler: this.screenHandler,
        });
        handler.addOnLeave(() => this.handleCameraTurningOff());
        this.pnpPreviewHandler = handler;
    }

    recordClicked() {
        this.props.onStartRecording({
            previewHandler: this.previewHandler,
            screenHandler: this.screenHandler,
        });
    }

    render() {
        return (
            <div>
                <RecordSelection
                    audio={this.state.enabled.audio}
                    camera={this.state.enabled.camera}
                    onSelectionChange={this.selectionRequest}
                    screen={this.state.enabled.screen}
                ></RecordSelection>
                <SelectionPreview
                    audioLevel={this.state.audio.level}
                    showAudio={!!this.state.audio.stream}
                    videoStream={this.state.previewStream}
                ></SelectionPreview>
                <button className="btn btn-outline-danger btn-lg px-4"
                    onClick={this.recordClicked}>
                    <FontAwesomeIcon className="mx-1"
                        icon={["fas", "circle"]}></FontAwesomeIcon>
                    Record
                </button>
            </div>
        );
    }
}

type IProps = {
    onStartRecording: OnStartRecordingCallback;
};
type IState = {
    audio: {
        level: number;
        stream?: MediaStream;
    };
    enabled: {
        audio: boolean;
        camera: boolean;
        screen: boolean;
    };
    previewStream?: MediaStream;
};

type OnStartRecordingCallback = (request: OnStartRecordingRequest) => void;
export type OnStartRecordingRequest = {
    previewHandler?: PreviewHandler;
    screenHandler?: ScreenHandler;
};
