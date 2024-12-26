<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalAnalyzeStore } from '@/stores/interval_analyze'
import { useRepeatCountStore } from '@/stores/repeat_count'
import CodeDate from '@/components/content/CodeDate.vue'
import Ball from '@/components/content/Ball.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
})

const intervalAnalyzeStore = useIntervalAnalyzeStore()
const repeatCountStore = useRepeatCountStore()
const { ballInterval, ballTailInterval, currentData, currentDataIndex } =
  storeToRefs(intervalAnalyzeStore)
const { repeatData } = storeToRefs(repeatCountStore)

const renderInterval = ref([])

watch([() => props.data, currentDataIndex], () => {
  intervalAnalyzeStore.setBallInterval()
  intervalAnalyzeStore.setBallTailInterval()
  intervalAnalyzeStore.setCurrentData(props.data)
  setRenderInterval()
})

function setRenderInterval() {
  renderInterval.value =
    props.type === 'interval' ? ballInterval.value : ballTailInterval.value
}

function setIntervalColor(index) {
  return intervalAnalyzeStore.setIntervalColor(index, props.type)
}

function getIntervalCount(index) {
  return intervalAnalyzeStore.getIntervalCountValue(index, props.type)
}

function setBallColor(num) {
  let color = 'bg-base-300'

  Object.values(currentData.value).forEach((item) => {
    if (item === num) {
      color = 'bg-error'
    } else if (repeatData.value.includes(num)) {
      color = 'bg-info'
    }
  })

  return color
}
</script>

<template>
  <div v-if="!data.length">
    <span class="loading loading-dots loading-sm"></span>
  </div>
  <div v-else>
    <CodeDate :data="currentData" />
    <table class="table">
      <thead>
        <tr>
          <th scope="col">区域</th>
          <th scope="col">号码</th>
          <th scope="col">次数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(interval, index) in renderInterval" :key="interval">
          <td :class="setIntervalColor(index, props.type)">
            {{
              props.type === 'interval'
                ? `[${interval[0]}, ${interval[interval.length - 1]}]`
                : `${interval[0].slice(-1)}`
            }}
          </td>
          <td class="flex gap-2">
            <Ball
              v-for="num in interval"
              :key="num"
              :num="num"
              :color="setBallColor(num)"
            />
          </td>
          <td>
            {{ getIntervalCount(index) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
