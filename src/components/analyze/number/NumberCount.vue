<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberAnalyzeStore } from '@/stores/number_analyze'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const numberAnalyzeStore = useNumberAnalyzeStore()
const { startIndex, endIndex, codeStep, startData, endData, groupResultData } =
  storeToRefs(numberAnalyzeStore)

const description =
  '这一部分用于统计给定区间的期次内，每个号码出现的次数。例如：给定的期次区间为7期，则统计这7期内，每个号码出现的次数，对应的表格就是7期中，出现0次的号码有哪些，总共有多少个；出现1次的号码有哪些，总共有多少个，以此类推。'

watch(
  () => props.data,
  () => {
    numberAnalyzeStore.setStartData(props.data)
    numberAnalyzeStore.setEndData(props.data)
    numberAnalyzeStore.setGroupResultData(props.data)

    checkNumberCountArrowStatus()
  },
)

watch([startIndex, endIndex], () => {
  numberAnalyzeStore.setStartData(props.data)
  numberAnalyzeStore.setEndData(props.data)
  numberAnalyzeStore.setGroupResultData(props.data)

  checkNumberCountArrowStatus()
})

function checkNumberCountArrowStatus() {
  numberAnalyzeStore.checkNumberCountArrowStatus(props.data)
}
</script>

<template>
  <div v-if="!data.length"></div>
  <div v-else>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-6">
          <CodeDate :data="startData" />
          <p>-</p>
          <CodeDate :data="endData" />
        </div>
        <p>共 {{ codeStep }} 期</p>
      </div>
    </div>

    <p class="py-6">{{ description }}</p>

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
            <Ball v-for="num in value.nums" :key="num" :num="num" />
          </td>
          <td>{{ value.total }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
