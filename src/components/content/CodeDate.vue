<script setup>
import { formatDay } from '@/assets/js/utils'

const props = defineProps({
  data: Array,
})
</script>

<template>
  <div class="overflow-auto" v-if="data.length === 1">
    <p>
      <span class="pr-3">第{{ data[0].code }}期</span>
      <span>{{ formatDay(data[0].day) }}</span>
    </p>
  </div>
  <div class="flex items-center gap-4" v-else>
    <p>
      <span class="pr-3">第{{ data[0].code }}期</span>
      <span>{{ formatDay(data[0].day) }}</span>
    </p>
    <p>-</p>
    <p>
      <span class="pr-3">第{{ data[1].code }}期</span>
      <span>{{ formatDay(data[1].day) }}</span>
    </p>
  </div>
</template>
