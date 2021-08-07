import React, { Component } from "react";
import ReactDOM from "react-dom";
import { RecordSelection } from "./record-selection";
import { SelectionPreview } from "./selection-preview";

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

    constructor(props: IProps) {
        super(props);

        this.state = {
            audio: {
                level: 0,
                stream: undefined,
            },
            camera: {
                stream: undefined,
            },
            enabled: {
                audio: false,
                camera: false,
                screen: false,
            },
            screen: {
                stream: undefined,
                isFullscreen: false,
            },
            videos: {
                preview: {
                    canvas: undefined,
                    compiledStream: undefined,
                    pictureInPictureStream: undefined,
                    stream: undefined,
                    videoElements: {
                        camera: undefined,
                        pictureInPicture: undefined,
                        screen: undefined,
                    },
                },
                record: {
                    stream: undefined,
                },
            },
        };

        this.selectionRequest = this.selectionRequest.bind(this);
        this.updateAudioLevel = this.updateAudioLevel.bind(this);
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
            // Audio was turned on!
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
            stream.addEventListener("oninactive", () => this.handleAudioTurningOff());
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
            requestAnimationFrame(this.updateAudioLevel);
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
        if (this.state.camera.stream) {
            this.state.camera.stream.getTracks().forEach((o) => o.stop());
        }
        this.setState({
            camera: {
                ...this.state.camera,
                stream: undefined,
            },
            enabled: {
                ...this.state.enabled,
                camera: false,
            },
        });
    }
    async handleCameraTurningOn() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false,
            });
            stream.addEventListener("oninactive", () => this.handleCameraTurningOff());
            this.setState({
                camera: {
                    ...this.state.camera,
                    stream: stream,
                },
                enabled: {
                    ...this.state.enabled,
                    camera: true,
                },
            });
        } catch (ex) {
            this.setState({
                camera: {
                    ...this.state.camera,
                    stream: undefined,
                },
                enabled: {
                    ...this.state.enabled,
                    camera: false,
                },
            });
            if (ex.name.includes("NotAllowedError")) {
                console.error(
                    "Asking for camera was denied. Check camera permissions.",
                    ex
                );
            } else if (ex.name.includes("NotFoundError")) {
                console.error(
                    "No camera found. Does laptop button need to be toggled?",
                    ex
                );
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
        if (this.state.screen.stream) {
            this.state.screen.stream.getTracks().forEach((o) => o.stop());
        }
        this.setState({
            screen: {
                ...this.state.screen,
                stream: undefined,
            },
            enabled: {
                ...this.state.enabled,
                screen: false,
            },
        });
    }
    async handleScreenTurningOn() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always",
                },
                audio: false,
            });
            const isFullscreen = stream
                .getTracks()
                .some((track) => {
                    return track.label.includes("screen");
                });
            stream.addEventListener("oninactive", () => this.handleScreenTurningOff());

            this.setState({
                screen: {
                    ...this.state.screen,
                    isFullscreen: isFullscreen,
                    stream: stream,
                },
                enabled: {
                    ...this.state.enabled,
                    screen: true,
                },
            });
        } catch (ex) {
            this.setState({
                screen: {
                    ...this.state.screen,
                    stream: undefined,
                },
                enabled: {
                    ...this.state.enabled,
                    screen: false,
                },
            });
            if (ex.name.includes("NotAllowedError")) {
                console.error("Asking for screen was denied. Likely cancelled.", ex);
            } else {
                console.error("Unknown exception while asking for screen.", ex);
            }
        }
    }

    async handleVideoChange() {
        this.clearPreviewStream();
        this.buildPreviewStream();

        this.clearPictureInPicturePreviewStream();
        await this.buildPictureInPicturePreviewStream();
    }
    clearPreviewStream() {
        if (this.state.videos.preview.compiledStream) {
            this.state.videos.preview.compiledStream.getTracks().forEach((o) => o.stop());
        }
        this.setState({
            videos: {
                ...this.state.videos,
                preview: {
                    ...this.state.videos.preview,
                    canvas: undefined,
                    compiledStream: undefined,
                    stream: undefined,
                    videoElements: {
                        ...this.state.videos.preview.videoElements,
                        camera: undefined,
                        screen: undefined,
                    },
                },
            },
        });
    }
    buildPreviewStream() {
        let cameraVideo: HTMLVideoElement | undefined = undefined;
        let compiledStream: MediaStream | undefined = undefined;
        let previewCanvas: HTMLCanvasElement | undefined = undefined;
        let previewStream: MediaStream | undefined = undefined;
        let screenVideo: HTMLVideoElement | undefined = undefined;

        if (this.state.screen.stream
            && this.state.screen.isFullscreen) {
            previewStream = this.state.screen.stream;
        } else if (
            !this.state.camera.stream &&
            this.state.screen.stream &&
            !this.state.screen.isFullscreen
        ) {
            previewStream = this.state.screen.stream;
        } else if (
            this.state.camera.stream &&
            this.state.screen.stream &&
            !this.state.screen.isFullscreen
        ) {
            cameraVideo = document.createElement("video");
            cameraVideo.autoplay = true;
            cameraVideo.height = 100;
            cameraVideo.width = 100;
            cameraVideo.srcObject = this.state.camera.stream;

            screenVideo = document.createElement("video");
            screenVideo.autoplay = true;
            screenVideo.height = 400;
            screenVideo.width = 500;
            screenVideo.srcObject = this.state.screen.stream;

            previewCanvas = document.createElement("canvas");
            previewCanvas.height = 500;
            previewCanvas.width = 500;
            previewStream = previewCanvas.captureStream();
            compiledStream = previewStream;
            const ctx = previewCanvas.getContext("2d");

            const updatePreviewWithCameraAndPartialStream = () => {
                if (
                    this.state.videos.preview.videoElements.screen &&
                    this.state.videos.preview.videoElements.camera
                ) {
                    ctx?.drawImage(
                        this.state.videos.preview.videoElements.screen,
                        0,
                        0,
                        500,
                        400
                    );
                    ctx?.drawImage(
                        this.state.videos.preview.videoElements.camera,
                        400,
                        400,
                        100,
                        100
                    );
                    requestAnimationFrame(updatePreviewWithCameraAndPartialStream);
                }
            };
            updatePreviewWithCameraAndPartialStream();
        } else if (this.state.camera.stream && !this.state.screen.stream) {
            previewStream = this.state.camera.stream;
        }

        this.setState({
            videos: {
                ...this.state.videos,
                preview: {
                    ...this.state.videos.preview,
                    canvas: previewCanvas,
                    compiledStream: compiledStream,
                    stream: previewStream,
                    videoElements: {
                        ...this.state.videos.preview.videoElements,
                        camera: cameraVideo,
                        screen: screenVideo,
                    }
                },
            },
        });
    }

    async clearPictureInPicturePreviewStream() {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        }
        this.setState({
            videos: {
                ...this.state.videos,
                preview: {
                    ...this.state.videos.preview,
                    videoElements: {
                        ...this.state.videos.preview.videoElements,
                        pictureInPicture: undefined,
                    },
                },
            },
        });
    }
    async buildPictureInPicturePreviewStream() {
        if (
            this.state.camera.stream &&
            this.state.screen.stream &&
            this.state.screen.isFullscreen
        ) {
            const pictureInPicture = document.createElement("video");
            pictureInPicture.autoplay = true;
            pictureInPicture.srcObject = this.state.camera.stream;
            pictureInPicture.addEventListener(
                "loadedmetadata",
                () => {
                    pictureInPicture.requestPictureInPicture();
                }
            );
            pictureInPicture.addEventListener(
                "leavepictureinpicture",
                () => {
                    this.handleCameraTurningOff();
                }
            );

            this.setState({
                videos: {
                    ...this.state.videos,
                    preview: {
                        ...this.state.videos.preview,
                        videoElements: {
                            ...this.state.videos.preview.videoElements,
                            pictureInPicture: pictureInPicture,
                        },
                    },
                },
            })
        }
    }

    render() {
        return (
            <div>
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                    <RecordSelection
                        audio={this.state.enabled.audio}
                        camera={this.state.enabled.camera}
                        onSelectionChange={this.selectionRequest}
                        screen={this.state.enabled.screen}></RecordSelection>

                    <SelectionPreview
                        audioLevel={this.state.audio.level}
                        showAudio={!!this.state.audio.stream}
                        videoStream={this.state.videos.preview.stream}
                    ></SelectionPreview>
                </div>
            </div >
        );
    }
}

type IProps = {};
type IState = {
    audio: {
        level: number,
        stream?: MediaStream,
    },
    camera: {
        stream?: MediaStream,
    },
    enabled: {
        audio: boolean,
        camera: boolean,
        screen: boolean,
    },
    screen: {
        stream?: MediaStream,
        isFullscreen: boolean,
    },
    videos: {
        preview: {
            canvas?: HTMLCanvasElement,
            compiledStream?: MediaStream,
            pictureInPictureStream?: MediaStream,
            stream?: MediaStream,
            videoElements: {
                camera?: HTMLVideoElement,
                pictureInPicture?: HTMLVideoElement,
                screen?: HTMLVideoElement,
            },
        },
        record: {
            stream?: MediaStream,
        },
    },
};
