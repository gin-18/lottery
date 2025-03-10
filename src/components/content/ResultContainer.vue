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
    <div class="flex items-center gap-6">
      <p>第{{ data.code }}期</p>
      <p>{{ formatDay(data.day) }}</p>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <Ball v-for="num in numbers" :key="num" :num="num" />
    </div>
  </div>
</template>
