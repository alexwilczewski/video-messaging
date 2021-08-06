<template>
  <div v-text="level"></div>
</template>

<script>
export default {
  props: {
    level: Number,
    max: Number,
  },
};
</script>
