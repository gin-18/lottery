<script setup>
import { storeToRefs } from 'pinia'
import { useRepeatCountStore } from '@/stores/number-statistics/repeat-number-statistics'
import { formatData, setBallColorInRange } from '@/assets/js/utils'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  currentCode: {
    type: [Object, null],
    required: true,
  },
  range: {
    type: [Array, null],
    required: true,
  },
  result: {
    type: [Object, null],
    required: true,
  },
  thead: {
    type: String,
  },
  description: {
    type: String,
  },
})

const repeatCountStore = useRepeatCountStore()
const { result: repeatCountResult } = storeToRefs(repeatCountStore)

function setBallColor(num) {
  const repeatNumbers = repeatCountResult.value
  const currentNumbers = formatData(props.currentCode).balls
  return setBallColorInRange(currentNumbers, repeatNumbers, num)
}
</script>

<template>
  <p>{{ description }}</p>
  <CodeDate v-if="currentCode" :data="[currentCode]" />
  <div class="overflow-x-auto">
    <table v-if="result" class="table">
      <thead>
        <tr>
          <th scope="col">{{ thead }}</th>
          <th scope="col">号码</th>
          <th scope="col">次数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in result.data" :key="key">
          <td class="whitespace-nowrap">
            {{ key }}
          </td>
          <td class="flex gap-2">
            <Ball
              v-for="num in value.range"
              :key="num"
              :num="num"
              :color="setBallColor(num)"
            />
          </td>
          <td>
            {{ value.times }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
