<script setup>
import { formatDay } from '@/assets/js/formatDay'

const props = defineProps({
  data: Object,
})
</script>

<template>
  <p class="d-flex align-center ga-2">
    <span>第{{ data.code }} 期</span>
    <span>{{ formatDay(data.day) }}</span>
  </p>
</template>
