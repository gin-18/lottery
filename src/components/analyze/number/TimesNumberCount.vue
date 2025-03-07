<script setup>
import { inject, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentResultStore } from '@/stores/current_result'
import { useRepeatCountStore } from '@/stores/repeat_count'
import { useTimesNumberCountStore } from '@/stores/times_number_count'
import { formatData, setBallColorInNumber } from '@/assets/js/utils'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const currentResultStore = useCurrentResultStore()
const { currentCode } = storeToRefs(currentResultStore)

const repeatCountStore = useRepeatCountStore()
const { result: repeatResult } = storeToRefs(repeatCountStore)

const timesNumberCountStore = useTimesNumberCountStore()
const {
  startCode,
  startCodeIndex,
  endCode,
  endCodeIndex,
  codeStep,
  result: timesNumberCountResult,
  description,
} = storeToRefs(timesNumberCountStore)

const rawDataArray = inject('rawDataArray')

watch([rawDataArray, startCodeIndex, endCodeIndex], () => {
  timesNumberCountStore.initData(rawDataArray.value)
  timesNumberCountStore.countNumberByTimes(rawDataArray.value)
})

function setNumberColor(num) {
  const currentCodeNumbers = formatData(currentCode.value).balls
  const repeatNumbers = repeatResult.value
  return setBallColorInNumber(currentCodeNumbers, repeatNumbers, num)
}
</script>

<template>
  <div>
    <p>{{ description }}</p>

    <div class="flex items-center gap-6">
      <CodeDate :data="startCode" />
      <p>-</p>
      <CodeDate :data="endCode" />
    </div>

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
        <tr v-for="(item, index) in timesNumberCountResult" :key="index">
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
  </div>
</template>
