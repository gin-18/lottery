<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalTimesStatisticsStore } from '@/stores/interval-statistics/interval-times-statistics'

const intervalTimesStatisticsStore = useIntervalTimesStatisticsStore()
const { codeStep, addButtonDisable, reduceButtonDisable } = storeToRefs(
  intervalTimesStatisticsStore,
)

const rawDataArray = inject('rawDataArray')

function addCodeStep() {
  intervalTimesStatisticsStore.addCodeStep(rawDataArray)
}

function reduceCodeStep() {
  intervalTimesStatisticsStore.reduceCodeStep()
}
</script>

<template>
  <h3>区间总数</h3>

  <h4>统计期次</h4>
  <div class="flex justify-between items-center">
    <button class="btn" :disabled="reduceButtonDisable" @click="reduceCodeStep">
      <span class="icon-[octicon--dash-16]"></span>
    </button>
    <p>{{ codeStep }}</p>
    <button class="btn" :disabled="addButtonDisable" @click="addCodeStep">
      <span class="icon-[octicon--plus-16]"></span>
    </button>
  </div>
</template>
