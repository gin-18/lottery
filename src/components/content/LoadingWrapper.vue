<script setup>
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <span v-if="isLoading" class="loading loading-bars loading-xl my-6"></span>
  <slot v-else></slot>
</template>
