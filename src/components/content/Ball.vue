<script setup>
const ballClass = 'flex justify-center items-center w-6 h-6 rounded-full text-xs text-ctp-base'
const props = defineProps({
  num: String,
  bgColor: {
    type: String,
    default: 'bg-ctp-red'
  }
})
</script>

<template>
  <p :class="[ballClass, bgColor]">{{ num }}</p>
</template>
