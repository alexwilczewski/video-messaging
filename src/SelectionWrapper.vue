<template>
  <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
    <record-selection
      @selectionRequest="selectionRequest"
      :audio="enabled.audio"
      :camera="enabled.camera"
      :screen="enabled.screen"
    ></record-selection>
  </div>

  <selection-preview
    :showAudio="showPreviewAudio"
    :audioLevel="audio.level"
    :audioMax="audio.max"
    :showVideo="showPreviewVideo"
    :videoStream="videos.preview.stream"
  ></selection-preview>
</template>

<script>
import RecordSelection from "./RecordSelection.vue";
import SelectionPreview from "./SelectionPreview.vue";

export default {
  components: { RecordSelection, SelectionPreview },
  computed: {
    showPreviewAudio() {
      return this.audio.analyser;
    },
    showPreviewVideo() {
      return !!this.videos.preview.stream;
    },
  },
  data() {
    return {
      audio: {
        analyser: null,
        inputs: null,
        level: 0,
        max: 4,
        stream: null,
      },
      camera: {
        stream: null,
      },
      enabled: {
        audio: false,
        camera: false,
        screen: false,
      },
      screen: {
        stream: null,
        isFullscreen: false,
      },
      videos: {
        preview: {
          canvas: null,
          compiledStream: null,
          pictureInPictureStream: null,
          stream: null,
          videoElements: {
            camera: null,
            pictureInPicture: null,
            screen: null,
          },
        },
        record: {
          stream: null,
        },
      },
    };
  },
  methods: {
    async init() {
      await this.selectionRequest({
        audio: false,
        camera: false,
        screen: false,
      });
    },
    async selectionRequest(request) {
      await this.handleSelectionRequestForAudio(request);
      await this.handleSelectionRequestForCamera(request);
      await this.handleSelectionRequestForScreen(request);
    },

    async handleSelectionRequestForAudio(request) {
      if (this.enabled.audio && request.audio) {
      } else if (this.enabled.audio && !request.audio) {
        this.handleAudioTurningOff();
      } else if (!this.enabled.audio && request.audio) {
        await this.handleAudioTurningOn();
      } else if (!this.enabled.audio && !request.audio) {
      }
    },
    handleAudioTurningOff() {
      if (this.audio.stream) {
        this.audio.stream.getTracks().forEach((o) => o.stop());
        this.audio.stream = null;
      }
      this.audio.analyser = null;
      this.audio.inputs = null;
      this.audio.level = 0;
      this.enabled.audio = false;
    },
    async handleAudioTurningOn() {
      try {
        this.audio.stream = await navigator.mediaDevices.getUserMedia({
          video: false,
          audio: true,
        });
        this.audio.stream.oninactive = () => {
          this.handleAudioTurningOff();
        };
        this.enabled.audio = true;
      } catch (ex) {
        this.audio.stream = null;
        this.enabled.audio = false;
        console.error(
          "Unable to turn on audio. Check to see if audio sharing is allowed.",
          ex
        );
      }

      if (this.enabled.audio) {
        try {
          this.handleCaptureAudioLevel();
        } catch (ex) {
          console.error("Unable to capture audio levels.", ex);
        }
      }
    },
    handleCaptureAudioLevel() {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(this.audio.stream);
      this.analyser = audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      this.audio.inputs = new Uint8Array(bufferLength);
      source.connect(this.analyser);
      this.updateAudioLevel();
    },
    updateAudioLevel() {
      if (this.audio.analyser) {
        const highSum = 7000;
        this.analyser.getByteFrequencyData(this.audio.inputs);
        var sum = this.audio.inputs.reduce((x, n) => x + n);
        var left = Math.min(1, sum / highSum);
        this.audio.level = Math.round(left * this.audio.max);
        requestAnimationFrame(this.updateAudioLevel);
      }
    },

    async handleSelectionRequestForCamera(request) {
      if (this.enabled.camera && request.camera) {
      } else if (this.enabled.camera && !request.camera) {
        this.handleCameraTurningOff();
      } else if (!this.enabled.camera && request.camera) {
        await this.handleCameraTurningOn();
      } else if (!this.enabled.camera && !request.camera) {
      }
    },
    handleCameraTurningOff() {
      if (this.camera.stream) {
        this.camera.stream.getTracks().forEach((o) => o.stop());
        this.camera.stream = null;
      }
      this.enabled.camera = false;
    },
    async handleCameraTurningOn() {
      try {
        this.camera.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        this.camera.stream.oninactive = () => {
          this.handleCameraTurningOff();
        };
        this.enabled.camera = true;
      } catch (ex) {
        this.camera.stream = null;
        this.enabled.camera = false;
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
    },

    async handleSelectionRequestForScreen(request) {
      if (this.enabled.screen && request.screen) {
      } else if (this.enabled.screen && !request.screen) {
        this.handleScreenTurningOff();
      } else if (!this.enabled.screen && request.screen) {
        await this.handleScreenTurningOn();
      } else if (!this.enabled.screen && !request.screen) {
      }
    },
    handleScreenTurningOff() {
      if (this.screen.stream) {
        this.screen.stream.getTracks().forEach((o) => o.stop());
        this.screen.stream = null;
      }
      this.enabled.screen = false;
    },
    async handleScreenTurningOn() {
      try {
        this.screen.stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: "always",
          },
          audio: false,
        });
        this.screen.isFullscreen = this.screen.stream
          .getTracks()
          .some((track) => {
            return track.label.includes("screen");
          });
        this.screen.stream.oninactive = () => {
          this.handleScreenTurningOff();
        };
        this.enabled.screen = true;
      } catch (ex) {
        this.screen.stream = null;
        this.enabled.screen = false;
        if (ex.name.includes("NotAllowedError")) {
          console.error("Asking for screen was denied. Likely cancelled.", ex);
        } else {
          console.error("Unknown exception while asking for screen.", ex);
        }
      }
    },

    async handleVideoChange() {
      this.clearPreviewStream();
      this.buildPreviewStream();

      this.clearPictureInPicturePreviewStream();
      await this.buildPictureInPicturePreviewStream();
    },
    clearPreviewStream() {
      if (this.videos.preview.compiledStream) {
        this.videos.preview.compiledStream.getTracks().forEach((o) => o.stop());
        this.videos.preview.compiledStream = null;
      }
      this.videos.preview.videoElements.camera = null;
      this.videos.preview.videoElements.screen = null;
      this.videos.preview.canvas = null;
      this.videos.preview.stream = null;
    },
    buildPreviewStream() {
      if (this.screen.stream && this.screen.isFullscreen) {
        this.videos.preview.stream = this.screen.stream;
      } else if (
        !this.camera.stream &&
        this.screen.stream &&
        !this.screen.isFullscreen
      ) {
        this.videos.preview.stream = this.screen.stream;
      } else if (
        this.camera.stream &&
        this.screen.stream &&
        !this.screen.isFullscreen
      ) {
        this.videos.preview.videoElements.camera =
          document.createElement("video");
        this.videos.preview.videoElements.camera.autoplay = true;
        this.videos.preview.videoElements.camera.height = 100;
        this.videos.preview.videoElements.camera.width = 100;
        this.videos.preview.videoElements.camera.srcObject = this.camera.stream;
        this.videos.preview.videoElements.screen =
          document.createElement("video");
        this.videos.preview.videoElements.screen.autoplay = true;
        this.videos.preview.videoElements.screen.height = 400;
        this.videos.preview.videoElements.screen.width = 500;
        this.videos.preview.videoElements.screen.srcObject = this.screen.stream;
        this.videos.preview.canvas = document.createElement("canvas");
        this.videos.preview.canvas.height = 500;
        this.videos.preview.canvas.width = 500;
        this.videos.preview.stream = this.videos.preview.canvas.captureStream();
        this.videos.preview.compiledStream = this.videos.preview.stream;
        const ctx = this.videos.preview.canvas.getContext("2d");

        const updatePreviewWithCameraAndPartialStream = () => {
          if (
            this.videos.preview.videoElements.screen &&
            this.videos.preview.videoElements.camera
          ) {
            ctx.drawImage(
              this.videos.preview.videoElements.screen,
              0,
              0,
              500,
              400
            );
            ctx.drawImage(
              this.videos.preview.videoElements.camera,
              400,
              400,
              100,
              100
            );
            requestAnimationFrame(updatePreviewWithCameraAndPartialStream);
          }
        };
        updatePreviewWithCameraAndPartialStream();
      } else if (this.camera.stream && !this.screen.stream) {
        this.videos.preview.stream = this.camera.stream;
      }
    },

    async clearPictureInPicturePreviewStream() {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
      this.videos.preview.videoElements.pictureInPicture = null;
    },
    async buildPictureInPicturePreviewStream() {
      if (
        this.camera.stream &&
        this.screen.stream &&
        this.screen.isFullscreen
      ) {
        this.videos.preview.videoElements.pictureInPicture =
          document.createElement("video");
        this.videos.preview.videoElements.pictureInPicture.autoplay = true;
        this.videos.preview.videoElements.pictureInPicture.srcObject =
          this.camera.stream;
        this.videos.preview.videoElements.pictureInPicture.addEventListener(
          "loadedmetadata",
          () => {
            this.videos.preview.videoElements.pictureInPicture.requestPictureInPicture();
          }
        );
        this.videos.preview.videoElements.pictureInPicture.addEventListener(
          "leavepictureinpicture",
          () => {
            this.handleCameraTurningOff();
          }
        );
      }
    },
  },
  async mounted() {
    await this.init();
  },
  watch: {
    "camera.stream"() {
      this.handleVideoChange();
    },
    "screen.stream"() {
      this.handleVideoChange();
    },
  },
};
</script>
