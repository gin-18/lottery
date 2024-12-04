<script setup>
/**
 * 这个组件用于渲染一期的开奖结果
 * 传入一期的数据，渲染开奖期次，开奖日期，开奖号码
 */
import { computed } from 'vue'
import { formatData } from '@/assets/js/count'
import { formatDay } from '@/assets/js/formatDay'
import Ball from '@/components/content/Ball.vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const ballList = computed(() => formatData(props.data).balls)
</script>

<template>
  <div class="d-flex flex-column ga-4">
    <div class="d-flex align-center ga-4 text-text">
      <p>第{{ data.code }}期</p>
      <p>{{ formatDay(data.day) }}</p>
    </div>

    <div class="d-flex align-center ga-4">
      <Ball v-for="num in ballList" :key="num" :num="num" />
    </div>
  </div>
</template>
