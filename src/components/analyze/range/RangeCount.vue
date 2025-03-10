<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRepeatCountStore } from '@/stores/repeat_count'
import { formatData, setBallColorInRange } from '@/assets/js/utils'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'

const props = defineProps({
  currentCode: {
    type: Object,
    required: true,
  },
  range: {
    type: Array,
    required: true,
  },
  result: {
    type: Object,
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

const isLoading = computed(() =>
  Object.keys(props.result).length ? false : true,
)

function setBallColor(num) {
  const repeatNumbers = repeatCountResult.value
  const currentNumbers = formatData(props.currentCode).balls
  return setBallColorInRange(currentNumbers, repeatNumbers, num)
}
</script>

<template>
  <LoadingWrapper :is-loading="isLoading">
    <p>{{ description }}</p>
    <CodeDate :data="[currentCode]" />
    <table class="table">
      <thead>
        <tr>
          <th scope="col">{{ thead }}</th>
          <th scope="col">号码</th>
          <th scope="col">次数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in result.data" :key="key">
          <td>
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
  </LoadingWrapper>
</template>
