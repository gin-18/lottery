<script setup>
const props = defineProps({
  num: String,
  color: {
    type: String,
    default: 'bg-ball-hot',
  },
})
</script>

<template>
  <p
    class="d-flex justify-center align-center pa-3 rounded-circle text-body-2 font-weight-bold"
    :class="color"
  >
    {{ num }}
  </p>
</template>

<style scoped>
p {
  width: 20px;
  height: 20px;
}
</style>
