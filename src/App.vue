<template>
  <div class="px-4 py-5 my-5 text-center">
    <h1 class="display-5 fw-bold mb-4">VidShare</h1>

    <div class="col-lg-6 mx-auto">
      <selection-wrapper></selection-wrapper>
    </div>
  </div>
</template>

<script>
import "./icons/entry";
import SelectionWrapper from "./SelectionWrapper.vue";

export default {
  components: { SelectionWrapper },
};
</script>
