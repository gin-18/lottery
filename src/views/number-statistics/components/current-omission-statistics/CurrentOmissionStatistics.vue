<script setup>
import { inject, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberDistributionStore } from '@/stores/number-statistics/number-distribution'
import { useCurrentNumberStatisticsStore } from '@/stores/number-statistics/current-number-statistics'
import { useRepeatNumberStatisticsStore } from '@/stores/number-statistics/repeat-number-statistics'
import { useCurrentOmissionStatisticsStore } from '@/stores/number-statistics/current-omission-statistics'
import { formatData, setBallColorInNumber } from '@/assets/js/utils'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const currentOmissionStatisticsStore = useCurrentOmissionStatisticsStore()
const {
  currentCode,
  rangeCode,
  currentCodeIndex,
  result: currentOmissionStatisticsResult,
  description,
} = storeToRefs(currentOmissionStatisticsStore)

const currentNumberStatisticsStore = useCurrentNumberStatisticsStore()
const { currentCode: currentResultCode } = storeToRefs(currentNumberStatisticsStore)

const repeatNumberStatisticsStore = useRepeatNumberStatisticsStore()
const { result: repeatResult } = storeToRefs(repeatNumberStatisticsStore)

const numberDistributionStore = useNumberDistributionStore()
const { numberCountData } = storeToRefs(numberDistributionStore)

const rawDataArray = inject('rawDataArray')

watch(currentCodeIndex, loadCurrentOmissionStatistics)

onMounted(loadCurrentOmissionStatistics)

function loadCurrentOmissionStatistics() {
  currentOmissionStatisticsStore.initData(rawDataArray.value)
  numberDistributionStore.initData(rangeCode.value)
  numberDistributionStore.countNumberOmission(rangeCode.value)
  currentOmissionStatisticsStore.countNumberByOmission(numberCountData.value)
}

function setNumberColor(num) {
  const currentCodeNumbers = formatData(currentResultCode.value).balls
  const repeatNumbers = repeatResult.value
  return setBallColorInNumber(currentCodeNumbers, repeatNumbers, num)
}
</script>

<template>
  <p>{{ description }}</p>
  <CodeDate v-if="currentCode" :data="[currentCode]" />
  <table class="table">
    <thead>
      <tr>
        <th>当前遗漏值</th>
        <th>号码</th>
        <th>个数</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key, index) in currentOmissionStatisticsResult" :key="index">
        <td>{{ key }}</td>
        <td class="flex flex-wrap gap-2">
          <Ball
            v-for="num in value"
            :key="num"
            :num="num"
            :color="setNumberColor(num)"
          />
        </td>
        <td>{{ value.length }}</td>
      </tr>
    </tbody>
  </table>
</template>
