<template>
  <button
    type="button"
    class="btn btn-lg px-4"
    :class="{ 'btn-outline-secondary': !camera, 'btn-secondary': camera }"
    @click="cameraToggle"
  >
    <font-awesome-check class="me-2" :on="camera" />Camera
  </button>

  <button
    type="button"
    class="btn btn-lg px-4"
    :class="{ 'btn-outline-secondary': !audio, 'btn-secondary': audio }"
    @click="audioToggle"
  >
    <font-awesome-check class="me-2" :on="audio" />Audio
  </button>

  <button
    type="button"
    class="btn btn-lg px-4"
    :class="{ 'btn-outline-secondary': !screen, 'btn-secondary': screen }"
    @click="screenToggle"
  >
    <font-awesome-check class="me-2" :on="screen" />Screen
  </button>
</template>

<script>
import FontAwesomeCheck from "./FontawesomeCheck.vue";

export default {
  components: { FontAwesomeCheck },
  emits: ["selectionRequest"],
  methods: {
    audioToggle() {
      this.emitRequest({
        audio: !this.audio,
        camera: this.camera,
        screen: this.screen,
      });
    },
    cameraToggle() {
      this.emitRequest({
        audio: this.audio,
        camera: !this.camera,
        screen: this.screen,
      });
    },
    screenToggle() {
      this.emitRequest({
        audio: this.audio,
        camera: this.camera,
        screen: !this.screen,
      });
    },
    emitRequest(request) {
      this.$emit("selectionRequest", request);
    },
  },
  props: {
    audio: Boolean,
    camera: Boolean,
    screen: Boolean,
  },
};
</script>
