<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useTailNumberStatisticsStore } from '@/stores/tail-statistics/tail-number-statistics'
import CodeDate from '@/components/content/CodeDate.vue'

const tailNumberStatisticsStore = useTailNumberStatisticsStore()
const { currentCode, previousButtonDisable, nextButtonDisable } =
  storeToRefs(tailNumberStatisticsStore)

const rawDataArray = inject('rawDataArray')

function goToPreviousCode() {
  tailNumberStatisticsStore.goToPreviousCode(rawDataArray.value)
}
function goToNextCode() {
  tailNumberStatisticsStore.goToNextCode()
}
</script>

<template>
  <h3>尾数统计</h3>
  <div>
    <h4>当前期次</h4>
    <div class="flex justify-between items-center">
      <button
        class="btn"
        :disabled="previousButtonDisable"
        @click="goToPreviousCode"
      >
        <span class="icon-[octicon--triangle-left-24]"></span>
      </button>
      <CodeDate v-if="currentCode" :data="[currentCode]" />
      <button class="btn" :disabled="nextButtonDisable" @click="goToNextCode">
        <span class="icon-[octicon--triangle-right-24]"></span>
      </button>
    </div>
  </div>
</template>
