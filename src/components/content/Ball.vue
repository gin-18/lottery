<script setup>
const props = defineProps({
  num: String,
  color: {
    type: String,
    default: 'bg-ball-hot'
  }
})
</script>

<template>
  <p class="d-flex justify-center align-center pa-3 rounded-circle text-body-2" :class="color">{{ num }}</p>
</template>

<style scoped>
p {
  width: 18px;
  height: 18px;
}
</style>
