<script setup>
import { computed } from 'vue'

const props = defineProps({
  num: String,
  color: {
    type: String,
    default: 'bg-error',
  },
})

const classList = computed(() => ({
  'flex justify-center items-center w-6 h-6 rounded-full text-base-100 text-xs font-semibold': true,
}))
</script>

<template>
  <span :class="[classList, color]">
    {{ num }}
  </span>
</template>
