<script setup>
import { formatDay } from '@/assets/js/formatDay'

const props = defineProps({
  startData: Object,
  lastData: Object,
})
</script>

<template>
  <div class="d-flex align-center ga-4">
    <p class="d-flex align-center ga-2">
      <span>第{{ startData.code }} 期</span>
      <span>{{ formatDay(startData.day) }}</span>
    </p>
    <p>-</p>
    <p class="d-flex align-center ga-2">
      <span>第{{ lastData.code }} 期</span>
      <span>{{ formatDay(lastData.day) }}</span>
    </p>
  </div>
</template>
