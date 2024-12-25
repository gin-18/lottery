<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { formatData } from '@/assets/js/count'
import { useCurrentResultStore } from '@/stores/current_result'
import { useTimesNumberAnalyzeStore } from '@/stores/times_number_analyze'
import { useRepeatAnalyzeStore } from '@/stores/repeat_analyze'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const currentResultStore = useCurrentResultStore()
const timesNumberAnalyzeStore = useTimesNumberAnalyzeStore()
const repeatAnalyzeStore = useRepeatAnalyzeStore()

const {
  startDataIndex,
  endDataIndex,
  codeStep,
  startData,
  endData,
  groupResultData,
} = storeToRefs(timesNumberAnalyzeStore)
const { resultData: repeatResultData } = storeToRefs(repeatAnalyzeStore)
const { resultData: currentResultData } = storeToRefs(currentResultStore)

const description =
  '这部分用于统计给定区间的期次内，每个号码出现的次数。例如：给定的期次区间为7期，则统计这7期内，每个号码出现的次数，对应的表格就是7期中，出现0次的号码有哪些，总共有多少个；出现1次的号码有哪些，总共有多少个，以此类推。'

watch([startDataIndex, endDataIndex, () => props.data], () => {
  timesNumberAnalyzeStore.setStartData(props.data)
  timesNumberAnalyzeStore.setEndData(props.data)
  timesNumberAnalyzeStore.setGroupResultData(props.data)

  checkNumberCountArrowStatus()
})

function checkNumberCountArrowStatus() {
  timesNumberAnalyzeStore.checkNumberCountArrowStatus(props.data)
}

function setNumberColor(num) {
  const currentData = formatData(currentResultData.value).balls

  if (repeatResultData.value.includes(num)) {
    return 'bg-info'
  } else if (currentData.includes(num)) {
    return 'bg-primary'
  }
}
</script>

<template>
  <div v-if="!data.length">
    <span class="loading loading-dots loading-sm"></span>
  </div>
  <div v-else>
    <p>{{ description }}</p>

    <div class="flex items-center gap-6">
      <CodeDate :data="startData" />
      <p>-</p>
      <CodeDate :data="endData" />
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
        <tr v-for="(value, key) in groupResultData" :key="key">
          <th>{{ key }}</th>
          <td class="flex flex-wrap gap-2">
            <Ball
              v-for="num in value.nums"
              :key="num"
              :num="num"
              :color="setNumberColor(num)"
            />
          </td>
          <td>{{ value.total }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-center gap-12">
      <div class="flex items-center">
        <p class="m-0">重复号码:</p>
        <div class="w-4 h-4 rounded bg-info"></div>
      </div>

      <div class="flex items-center">
        <p class="m-0">当前期次号码:</p>
        <div class="w-4 h-4 rounded bg-primary"></div>
      </div>
    </div>
  </div>
</template>
