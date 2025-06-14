<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberTimesStatisticsStore } from '@/stores/number-statistics/number-times-statistics'
import CodeDate from '@/components/content/CodeDate.vue'

const numberTimesStatisticsStore = useNumberTimesStatisticsStore()
const {
  startCode,
  endCode,
  codeStep,
  startCodePreviousButtonDisable,
  startCodeNextButtonDisable,
  endCodePreviousButtionDisable,
  endCodeNextButtonDisable,
} = storeToRefs(numberTimesStatisticsStore)

const rawDataArray = inject('rawDataArray')

function goToPreviousStartCode() {
  numberTimesStatisticsStore.goToPreviousStartCode(rawDataArray.value)
}
function goToNextStartCode() {
  numberTimesStatisticsStore.goToNextStartCode()
}

function goToPreviousEndCode() {
  numberTimesStatisticsStore.goToPreviousEndCode()
}
function goToNextEndCode() {
  numberTimesStatisticsStore.goToNextEndCode()
}
</script>

<template>
  <div>
    <h3>号码统计</h3>
    <p>共 {{ codeStep }} 期</p>
    <div>
      <div>
        <h4>起始期次</h4>
        <div class="flex justify-between items-center">
          <button
            class="btn"
            :disabled="startCodePreviousButtonDisable"
            @click="goToPreviousStartCode"
          >
            <span class="icon-[octicon--triangle-left-24]"></span>
          </button>
          <CodeDate v-if="startCode" :data="[startCode]" />
          <button
            class="btn"
            :disabled="startCodeNextButtonDisable"
            @click="goToNextStartCode"
          >
            <span class="icon-[octicon--triangle-right-24]"></span>
          </button>
        </div>
      </div>

      <div>
        <h4>结束期次</h4>
        <div class="flex justify-between items-center">
          <button
            class="btn"
            :disabled="endCodePreviousButtionDisable"
            @click="goToPreviousEndCode"
          >
            <span class="icon-[octicon--triangle-left-24]"></span>
          </button>
          <CodeDate v-if="endCode" :data="[endCode]" />
          <button
            class="btn"
            :disabled="endCodeNextButtonDisable"
            @click="goToNextEndCode"
          >
            <span class="icon-[octicon--triangle-right-24]"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
