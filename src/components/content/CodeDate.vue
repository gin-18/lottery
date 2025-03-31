<script setup>
import { formatDay } from '@/assets/js/utils'

const props = defineProps({
  data: Array,
})
</script>

<template>
  <div class="overflow-auto" v-if="data.length === 1">
    <p>
      <span class="mr-2">第{{ data[0].code }}期</span>
      <span>{{ formatDay(data[0].day) }}</span>
    </p>
  </div>
  <div v-else>
    <div class="flex items-center gap-6 md:hidden">
      <div>
        <p class="m-0">第{{ data[0].code }}期</p>
        <p class="m-0">{{ formatDay(data[0].day) }}</p>
      </div>
      <p>-</p>
      <div>
        <p class="m-0">第{{ data[1].code }}期</p>
        <p class="m-0">{{ formatDay(data[1].day) }}</p>
      </div>
    </div>
    <div class="hidden md:flex md:items-center md:gap-4">
      <p>
        <span class="mr-2">第{{ data[0].code }}期</span>
        <span>{{ formatDay(data[0].day) }}</span>
      </p>
      <p>-</p>
      <p>
        <span class="mr-2">第{{ data[1].code }}期</span>
        <span>{{ formatDay(data[1].day) }}</span>
      </p>
    </div>
  </div>
</template>
