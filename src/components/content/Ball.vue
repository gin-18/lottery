<script setup>
const ballClass = 'flex justify-center items-center w-6 h-6 rounded-full text-xs text-ctp-crust'
const props = defineProps({
  num: [String, Number],
  bgColor: {
    type: String,
    default: 'bg-ctp-red'
  }
})
</script>

<template>
  <p :class="[ballClass, bgColor]">{{ num }}</p>
</template>
