<script setup>
const props = defineProps({
  num: String,
  color: {
    type: String,
    default: 'bg-red-lighten-1'
  }
})
</script>

<template>
  <p class="d-flex justify-center align-center rounded-circle" :class="color">{{ num }}</p>
</template>

<style scoped>
p {
  width: 28px;
  height: 28px;
}
</style>
