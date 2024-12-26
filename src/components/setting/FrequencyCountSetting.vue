<script setup>
import { storeToRefs } from 'pinia'
import { useFrequencyCountStore } from '@/stores/frequency_count'

const frequencyCountStore = useFrequencyCountStore()
const { codeStep } = storeToRefs(frequencyCountStore)

function addFrequencyStep() {
  frequencyCountStore.addCodeStep()
}
function reduceFrequencyStep() {
  frequencyCountStore.reduceCodeStep()
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
