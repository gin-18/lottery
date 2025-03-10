<script setup>
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <template v-if="isLoading">
    <span class="loading loading-bars loading-xl my-6"></span>
  </template>
  <template v-else>
    <slot></slot>
  </template>
</template>
