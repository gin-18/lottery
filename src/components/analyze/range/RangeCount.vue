<script setup>
import { storeToRefs } from 'pinia'
import { useIntervalCountStore } from '@/stores/interval_count'
import { useRepeatCountStore } from '@/stores/repeat_count'
import CodeDate from '@/components/content/CodeDate.vue'
import Ball from '@/components/content/Ball.vue'

const props = defineProps({
  currentCode: {
    type: Object,
    required: true,
  },
  range: {
    type: Array,
    required: true,
  },
  category: {
    type: Array,
    required: true,
  },
  thead: {
    type: String,
  },
})

const repeatCountStore = useRepeatCountStore()
const { result } = storeToRefs(repeatCountStore)

const intervalCountStore = useIntervalCountStore()

function setIntervalColor(index) {
  return intervalCountStore.setIntervalColor(index, props.type)
}

function getIntervalCount(index) {
  return intervalCountStore.getIntervalCountValue(index, props.type)
}

function setBallColor(num) {
  let color = 'bg-base-300'

  Object.values(props.currentCode).forEach((item) => {
    if (item === num) {
      color = 'bg-error'
    } else if (result.value.includes(num)) {
      color = 'bg-info'
    }
  })

  return color
}
</script>

<template>
  <CodeDate :data="currentCode" />

  <table class="table">
    <thead>
      <tr>
        <th scope="col">{{ thead }}</th>
        <th scope="col">号码</th>
        <th scope="col">次数</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(interval, index) in range" :key="interval">
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

  <div class="flex justify-center items-center gap-12">
    <div class="flex items-center gap-2" v-for="interval in category">
      <p class="m-0">{{ interval.title }}(>={{ interval.weight }}):</p>
      <span class="w-4 h-4 rounded" :class="interval.backgroundColor"></span>
    </div>
  </div>
</template>
