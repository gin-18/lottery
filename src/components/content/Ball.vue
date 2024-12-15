<script setup>
const props = defineProps({
  num: String,
  color: {
    type: String,
    default: 'bg-error',
  },
})
</script>

<template>
  <span
    class="flex justify-center items-center w-7 h-7 rounded-full text-base-100 text-sm font-semibold"
    :class="color"
  >
    {{ num }}
  </span>
</template>
