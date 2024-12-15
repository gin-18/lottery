<script setup>
import { formatDay } from '@/assets/js/formatDay'

const props = defineProps({
  data: Object,
})
</script>

<template>
  <p>
    <span class="pr-3">第{{ data.code }}期</span>
    <span>{{ formatDay(data.day) }}</span>
  </p>
</template>
