<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useTailTimesStatisticsStore } from '@/stores/tail-statistics/tail-times-statistics'

const tailTimesStatisticsStore = useTailTimesStatisticsStore()
const { codeStep, addButtonDisable, reduceButtonDisable } =
  storeToRefs(tailTimesStatisticsStore)

const rawDataArray = inject('rawDataArray')

function addCodeStep() {
  tailTimesStatisticsStore.addCodeStep(rawDataArray.value)
}

function reduceCodeStep() {
  tailTimesStatisticsStore.reduceCodeStep()
}
</script>

<template>
  <h3>尾数总数</h3>

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
