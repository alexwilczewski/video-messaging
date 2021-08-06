<template>
  <video-preview v-show="showVideo" :stream="videoStream"></video-preview>
  <audio-preview
    v-show="showAudio"
    :level="audioLevel"
    :max="audioMax"
  ></audio-preview>
</template>

<script>
import AudioPreview from "./AudioPreview.vue";
import VideoPreview from "./VideoPreview.vue";

export default {
  components: { AudioPreview, VideoPreview },
  props: {
    audioLevel: Number,
    audioMax: Number,
    showAudio: Boolean,
    showVideo: Boolean,
    videoStream: Object,
  },
};
</script>
