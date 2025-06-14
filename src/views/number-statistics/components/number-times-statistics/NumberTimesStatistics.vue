<script setup>
import { inject, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentNumberStatisticsStore } from '@/stores/number-statistics/current-number-statistics'
import { useRepeatNumberStatisticsStore } from '@/stores/number-statistics/repeat-number-statistics'
import { useNumberTimesStatisticsStore } from '@/stores/number-statistics/number-times-statistics'
import { formatData, setBallColorInNumber } from '@/assets/js/utils'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const currentNumberStatisticsStore = useCurrentNumberStatisticsStore()
const { currentCode } = storeToRefs(currentNumberStatisticsStore)

const repeatNumerStatisticsStore = useRepeatNumberStatisticsStore()
const { result: repeatResult } = storeToRefs(repeatNumerStatisticsStore)

const numberTimesStatisticsStore = useNumberTimesStatisticsStore()
const {
  startCode,
  startCodeIndex,
  endCode,
  endCodeIndex,
  codeStep,
  result: numberTimesStatisticsResult,
  description,
} = storeToRefs(numberTimesStatisticsStore)

const rawDataArray = inject('rawDataArray')

watch([startCodeIndex, endCodeIndex], loadTimesNumberCount)

onMounted(loadTimesNumberCount)

function loadTimesNumberCount() {
  numberTimesStatisticsStore.initData(rawDataArray.value)
  numberTimesStatisticsStore.countNumberByTimes(rawDataArray.value)
}

function setNumberColor(num) {
  const currentCodeNumbers = formatData(currentCode.value).balls
  const repeatNumbers = repeatResult.value
  return setBallColorInNumber(currentCodeNumbers, repeatNumbers, num)
}
</script>

<template>
  <p>{{ description }}</p>
  <CodeDate v-if="startCode && endCode" :data="[startCode, endCode]" />
  <p>共 {{ codeStep }} 期</p>
  <table class="table">
    <thead>
      <tr>
        <th>次数</th>
        <th>号码</th>
        <th>个数</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in numberTimesStatisticsResult" :key="index">
        <td>{{ item.times }}</td>
        <td class="flex flex-wrap gap-2">
          <Ball
            v-for="num in item.nums"
            :key="num"
            :num="num"
            :color="setNumberColor(num)"
          />
        </td>
        <td>{{ item.total }}</td>
      </tr>
    </tbody>
  </table>
  <div class="flex justify-center gap-12">
    <div class="flex items-center gap-2">
      <p class="m-0">重复号码:</p>
      <div class="w-4 h-4 rounded bg-info"></div>
    </div>
    <div class="flex items-center gap-2">
      <p class="m-0">当前开奖号码:</p>
      <div class="w-4 h-4 rounded bg-primary"></div>
    </div>
  </div>
</template>
