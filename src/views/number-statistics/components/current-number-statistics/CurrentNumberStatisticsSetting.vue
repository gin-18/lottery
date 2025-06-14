<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentNumberStatisticsStore } from '@/stores/number-statistics/current-number-statistics'
import CodeDate from '@/components/content/CodeDate.vue'

const currentNumberStatistics = useCurrentNumberStatisticsStore()
const { currentCode, previousButtonDisable, nextButtonDisable } = storeToRefs(
  currentNumberStatistics,
)

const rawDataArray = inject('rawDataArray')

function goToPreviousCode() {
  currentNumberStatistics.goToPreviousCode(rawDataArray.value)
}
function goToNextCode() {
  currentNumberStatistics.goToNextCode()
}
</script>

<template>
  <h3>当前开奖</h3>
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
