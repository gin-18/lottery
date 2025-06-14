<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useRepeatNumberStatisticsStore } from '@/stores/number-statistics/repeat-number-statistics'
import CodeDate from '@/components/content/CodeDate.vue'

const repeatNumberStatisticsStore = useRepeatNumberStatisticsStore()
const { currentCode, previousButtonDisable, nextButtonDisable } = storeToRefs(
  repeatNumberStatisticsStore,
)

const rawDataArray = inject('rawDataArray')

function goToPreviousCode() {
  repeatNumberStatisticsStore.goToPreviousCode(rawDataArray.value)
}

function goToNextCode() {
  repeatNumberStatisticsStore.goToNextCode()
}
</script>

<template>
  <h3>重号统计</h3>
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
