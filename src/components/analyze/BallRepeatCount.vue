<script setup>
/**
 * 这个组件用于统计最近2期重复出现的号码
 */
import { ref, onMounted } from 'vue'
import { getBallNum, findDuplicates } from '@/assets/js/count'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const startData = ref({}) // 开始期次
const lastData = ref({}) // 最新期次数据
const codeStep = ref(2) // 期数
const resultData = ref({}) // 统计后的数据

const description = '这一部分只统计最近2期内，重复出现的号码，重复出现的个数。'

onMounted(() => {
  lastData.value = props.data[0]
  startData.value = props.data[codeStep.value - 1]
  countRepeatBall()
})

function countRepeatBall() {
  const startBall = getBallNum(startData.value)
  const lastBall = getBallNum(lastData.value)

  resultData.value = findDuplicates(startBall, lastBall)
}
</script>

<template>
  <p class="py-6">{{ description }}</p>

  <div class="d-flex align-center ga-4 pb-4">
    <CodeDate :data="startData" />
    <p>-</p>
    <CodeDate :data="lastData" />
  </div>

  <div class="d-flex ga-4">
    <p>共 {{ resultData.length }} 个:</p>
    <Ball v-for="num in resultData" :key="num" :num="num" />
  </div>
</template>
