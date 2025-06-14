<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useTailTendencyStatisticsStore } from '@/stores/tail-statistics/tail-tendency-statistics'

const tailTendencyStatisticsStore = useTailTendencyStatisticsStore()
const { codeStep, addButtonDisable, reduceButtonDisable } = storeToRefs(
  tailTendencyStatisticsStore,
)

const rawDataArray = inject('rawDataArray')

function addCodeStep() {
  tailTendencyStatisticsStore.addCodeStep(rawDataArray.value)
}
function reduceCodeStep() {
  tailTendencyStatisticsStore.reduceCodeStep()
}
</script>

<template>
  <h3>尾数走势</h3>

  <div>
    <h4>统计期次</h4>
    <div class="flex justify-between items-center">
      <button
        class="btn"
        :disabled="reduceButtonDisable"
        @click="reduceCodeStep"
      >
        <span class="icon-[octicon--dash-16]"></span>
      </button>
      <p>{{ codeStep }}</p>
      <button class="btn" :disabled="addButtonDisable" @click="addCodeStep">
        <span class="icon-[octicon--plus-16]"></span>
      </button>
    </div>
  </div>
</template>
