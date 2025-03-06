<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { formatData } from '@/assets/js/utils'
import { useCurrentResultStore } from '@/stores/current_result'
import { useTimesNumberCountStore } from '@/stores/times_number_count'
import { useRepeatCountStore } from '@/stores/repeat_count'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const currentResultStore = useCurrentResultStore()
const timesNumberCountStore = useTimesNumberCountStore()
const repeatCountStore = useRepeatCountStore()

const {
  startDataIndex,
  endDataIndex,
  codeStep,
  startData,
  endData,
  timesNumberCountData,
  description,
} = storeToRefs(timesNumberCountStore)
const { repeatData } = storeToRefs(repeatCountStore)
const { currentCode } = storeToRefs(currentResultStore)

watch([() => props.data, startDataIndex, endDataIndex], () => {
  timesNumberCountStore.setStartData(props.data)
  timesNumberCountStore.setEndData(props.data)
  timesNumberCountStore.countNumberByTimes(props.data)
  checkNumberCountArrowStatus()
})

function checkNumberCountArrowStatus() {
  timesNumberCountStore.checkNumberCountArrowStatus(props.data)
}

function setNumberColor(num) {
  const currentCodeData = formatData(currentCode.value).balls

  if (repeatData.value.includes(num)) {
    return 'bg-info'
  } else if (currentCodeData.includes(num)) {
    return 'bg-primary'
  }
}
</script>

<template>
  <span v-if="!data.length" class="loading loading-dots"></span>
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
        <tr v-for="(item, index) in timesNumberCountData" :key="index">
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
        <p class="m-0">当前期次号码:</p>
        <div class="w-4 h-4 rounded bg-primary"></div>
      </div>
    </div>
  </div>
</template>
