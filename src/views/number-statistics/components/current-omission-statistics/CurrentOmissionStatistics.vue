<script setup>
import { inject, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberDistributionStore } from '@/stores/number_distribution'
import { useCurrentResultStore } from '@/stores/current_result'
import { useRepeatCountStore } from '@/stores/repeat_count'
import { useOmissionCountStore } from '@/stores/omission_count'
import { formatData, setBallColorInNumber } from '@/assets/js/utils'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const omissionCountStore = useOmissionCountStore()
const {
  currentCode,
  rangeCode,
  currentCodeIndex,
  result: currentOmissionResult,
  description,
} = storeToRefs(omissionCountStore)

const currentResultStore = useCurrentResultStore()
const { currentCode: currentResultCode } = storeToRefs(currentResultStore)

const repeatCountStore = useRepeatCountStore()
const { result: repeatResult } = storeToRefs(repeatCountStore)

const numberDistributionStore = useNumberDistributionStore()
const { numberCountData } = storeToRefs(numberDistributionStore)

const rawDataArray = inject('rawDataArray')

watch(currentCodeIndex, loadCurrentOmissionCount)

onMounted(loadCurrentOmissionCount)

function loadCurrentOmissionCount() {
  omissionCountStore.initData(rawDataArray.value)
  numberDistributionStore.initData(rangeCode.value)
  numberDistributionStore.countNumberOmission(rangeCode.value)
  omissionCountStore.countNumberByOmission(numberCountData.value)
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
      <tr v-for="(value, key, index) in currentOmissionResult" :key="index">
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
