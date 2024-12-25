<script setup>
import { storeToRefs } from 'pinia'
import { useFrequencyAnalyzeStore } from '@/stores/frequency_analyze'

const frequencyAnalyzeStore = useFrequencyAnalyzeStore()
const { codeStep } = storeToRefs(frequencyAnalyzeStore)

function addFrequencyStep() {
  frequencyAnalyzeStore.addCodeStep()
}
function reduceFrequencyStep() {
  frequencyAnalyzeStore.reduceCodeStep()
}
</script>

<template>
  <h3>号码频率设置</h3>
  <div>
    <h4>统计步长：</h4>
    <div class="flex justify-between items-center">
      <button class="btn" @click="reduceFrequencyStep">
        <span class="icon-[octicon--dash-16]"></span>
      </button>
      <p>{{ codeStep }}</p>
      <button class="btn" @click="addFrequencyStep">
        <span class="icon-[octicon--plus-16]"></span>
      </button>
    </div>
  </div>
</template>
