<script setup>
/**
 * 这个组件用于统计最近2期重复出现的号码
 */
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRepeatAnalyzeStore } from '@/stores/repeat_analyze'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const repeatAnalyzeStore = useRepeatAnalyzeStore()
const { startData, currentData, resultData, currentDataIndex } =
  storeToRefs(repeatAnalyzeStore)

const description =
  '这部分只统计当前期次到它前一期，重复出现的个数，以及重复出现的号码。'

watch([() => props.data, currentDataIndex], () => {
  repeatAnalyzeStore.setStartData(props.data)
  repeatAnalyzeStore.setCurrentData(props.data)
  repeatAnalyzeStore.setResultData()
})
</script>

<template>
  <div v-if="!data.length">
    <span class="loading loading-dots loading-sm"></span>
  </div>
  <div v-else>
    <p>{{ description }}</p>

    <div class="flex items-center gap-4">
      <CodeDate :data="startData" />
      <p>-</p>
      <CodeDate :data="currentData" />
    </div>

    <div class="flex items-center gap-4">
      <p>共 {{ resultData.length }} 个:</p>
      <Ball v-for="num in resultData" :key="num" :num="num" />
    </div>
  </div>
</template>
