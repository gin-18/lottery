<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberDistributionStore } from '@/stores/number_distribution'
import { useCurrentResultStore } from '@/stores/current_result'
import { useRepeatCountStore } from '@/stores/repeat_count'
import { useOmissionCountStore } from '@/stores/omission_count'
import { formatData } from '@/assets/js/utils'
import CodeDate from '@/components/content/CodeDate.vue'
import Ball from '@/components/content/Ball.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const numberDistributionStore = useNumberDistributionStore()
const omissionCountStore = useOmissionCountStore()
const currentResultStore = useCurrentResultStore()
const repeatCountStore = useRepeatCountStore()

const { numberCountData } = storeToRefs(numberDistributionStore)
const { currentCode: currentResultCode } = storeToRefs(currentResultStore)
const { repeatData } = storeToRefs(repeatCountStore)
const { currentCode, groupCode, currentCodeIndex, result, description } =
  storeToRefs(omissionCountStore)

watch([() => props.data, currentCodeIndex], () => {
  omissionCountStore.initData(props.data)
  numberDistributionStore.setData(groupCode.value)
  numberDistributionStore.countNumberOmission(groupCode.value)
  omissionCountStore.countNumberByOmission(numberCountData.value)
})

// TODO: this function repeated in multiple components
function setNumberColor(num) {
  const currentCodeData = formatData(currentResultCode.value).balls

  if (repeatData.value.includes(num)) {
    return 'bg-info'
  } else if (currentCodeData.includes(num)) {
    return 'bg-primary'
  }
}
</script>

<template>
  <p>{{ description }}</p>

  <CodeDate :data="currentCode" />

  <table class="table">
    <thead>
      <tr>
        <th>当前遗漏值</th>
        <th>号码</th>
        <th>个数</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key, index) in result" :key="index">
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
