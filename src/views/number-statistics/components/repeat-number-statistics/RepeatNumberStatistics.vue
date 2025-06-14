<script setup>
import { inject, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRepeatNumberStatisticsStore } from '@/stores/number-statistics/repeat-number-statistics'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const rawDataArray = inject('rawDataArray')

const repeatNumberStatisticsStore = useRepeatNumberStatisticsStore()
const { startCode, currentCode, currentCodeIndex, result, description } =
  storeToRefs(repeatNumberStatisticsStore)

watch(currentCodeIndex, loadRepeatCount)

onMounted(loadRepeatCount)

function loadRepeatCount() {
  repeatNumberStatisticsStore.initData(rawDataArray.value)
  repeatNumberStatisticsStore.countRepeatNumber()
}
</script>

<template>
  <p>{{ description }}</p>
  <CodeDate v-if="startCode && currentCode" :data="[startCode, currentCode]" />
  <div class="flex items-center gap-4" v-if="result">
    <p>共 {{ result.length }} 个:</p>
    <Ball v-for="num in result" :key="num" :num="num" />
  </div>
</template>
