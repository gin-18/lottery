<script setup>
import { computed } from 'vue'
import { formatDay, formatData } from '@/assets/js/utils'
import Ball from '@/components/content/Ball.vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const numbers = computed(() => formatData(props.data).balls)
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <p>第{{ data.code }}期</p>
      <p>{{ formatDay(data.day) }}</p>
    </div>

    <div
      class="grid grid-cols-10 gap-4 md:flex md:flex-wrap md:items-center md:gap-4"
    >
      <Ball v-for="num in numbers" :key="num" :num="num" />
    </div>
  </div>
</template>
