<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberFrequencyStatisticsStore } from '@/stores/number-statistics/number-frequency-statistics'

const numberFrequencyStatisticsStore = useNumberFrequencyStatisticsStore()
const { codeStep, addButtonDisable, reduceButtonDisable } =
  storeToRefs(numberFrequencyStatisticsStore)

const rawDataArray = inject('rawDataArray')

function addCodeStep() {
  numberFrequencyStatisticsStore.addCodeStep(rawDataArray.value)
}
function reduceCodeStep() {
  numberFrequencyStatisticsStore.reduceCodeStep()
}
</script>

<template>
  <h3>号码频率</h3>
  <div>
    <h4>统计步长</h4>
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
