<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalNumberStatisticsStore } from '@/stores/interval-statistics/interval-number-statistics'
import CodeDate from '@/components/content/CodeDate.vue'

const intervalNumberStatisticsStore = useIntervalNumberStatisticsStore()
const { currentCode, previousButtonDisable, nextButtonDisable } =
  storeToRefs(intervalNumberStatisticsStore)

const rawDataArray = inject('rawDataArray')

function goToPreviousCode() {
  intervalNumberStatisticsStore.goToPreviousCode(rawDataArray.value)
}
function goToNextCode() {
  intervalNumberStatisticsStore.goToNextCode()
}
</script>

<template>
  <h3>区间统计</h3>
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
