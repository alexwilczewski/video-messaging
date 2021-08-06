<template>
  <font-awesome-icon v-if="on" :icon="['fas', 'check-circle']" />
  <font-awesome-icon v-else :icon="['far', 'check-circle']" />
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: { FontAwesomeIcon },
  props: {
    on: Boolean,
  },
};
</script>
