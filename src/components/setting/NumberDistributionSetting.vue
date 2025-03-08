<script setup>
import { storeToRefs } from 'pinia'
import { useNumberDistributionStore } from '@/stores/number_distribution'

const numberDistributionStore = useNumberDistributionStore()
const { codeStep, previousButtonDisable, nextButtonDisable } = storeToRefs(
  numberDistributionStore,
)

function goToNextStep() {
  numberDistributionStore.goToNextCodeStep()
}

function goToPreviousStep() {
  numberDistributionStore.goToPreviousCodeStep()
}
</script>

<template>
  <h3>号码分布设置</h3>
  <div>
    <h4>统计期次</h4>
    <div class="flex justify-between items-center">
      <button
        class="btn"
        :disabled="previousButtonDisable"
        @click="goToPreviousStep"
      >
        <span class="icon-[octicon--triangle-left-24]"></span>
      </button>
      <p>{{ codeStep }}</p>
      <button class="btn" :disabled="nextButtonDisable" @click="goToNextStep">
        <span class="icon-[octicon--triangle-right-24]"></span>
      </button>
    </div>
  </div>
</template>
