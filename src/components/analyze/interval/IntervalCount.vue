<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalCountStore } from '@/stores/interval_count'
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

const intervalCountStore = useIntervalCountStore()
const repeatCountStore = useRepeatCountStore()
const { numberInterval, numberTailInterval, currentData, currentDataIndex } =
  storeToRefs(intervalCountStore)
const { repeatData } = storeToRefs(repeatCountStore)

const renderInterval = ref([])

watch([() => props.data, currentDataIndex], () => {
  intervalCountStore.setNumberInterval()
  intervalCountStore.setNumberTailInterval()
  intervalCountStore.setCurrentData(props.data)
  setRenderInterval()
})

function setRenderInterval() {
  renderInterval.value =
    props.type === 'interval' ? numberInterval.value : numberTailInterval.value
}

function setIntervalColor(index) {
  return intervalCountStore.setIntervalColor(index, props.type)
}

function getIntervalCount(index) {
  return intervalCountStore.getIntervalCountValue(index, props.type)
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
            <!-- {{ getIntervalCount(index) }} -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
