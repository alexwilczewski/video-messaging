<template>
  <video ref="video" autoplay="autoplay"></video>
</template>

<script>
export default {
  props: {
    stream: Object,
  },
  watch: {
    stream() {
      if (this.stream) {
        this.$refs.video.srcObject = this.stream;
      } else {
        this.$refs.video.srcObject = null;
      }
    },
  },
};
</script>
