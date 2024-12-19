<script setup>
/**
 * 这个组件用于渲染一期的开奖结果
 * 传入一期的数据，渲染开奖期次，开奖日期，开奖号码
 */
import { computed } from 'vue'
import { formatData } from '@/assets/js/count'
import { formatDay } from '@/assets/js/utils'
import Ball from '@/components/content/Ball.vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const numberList = computed(() => formatData(props.data).balls)
</script>

<template>
  <div>
    <div class="flex items-center gap-6">
      <p>第{{ data.code }}期</p>
      <p>{{ formatDay(data.day) }}</p>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <Ball v-for="num in numberList" :key="num" :num="num" />
    </div>
  </div>
</template>
