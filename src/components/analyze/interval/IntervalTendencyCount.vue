<script setup>
/**
 * 绘制的数据：
 * {
 *   'range': {
 *     'code1': times,
 *     'code2': times,
 *   },
 *   ...
 * }
 **/
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalAnalyzeStore } from '@/stores/interval_analyze'
import { countAllByRange } from '@/assets/js/count'
import { chartPalette } from '@/assets/js/palette'
import Chart from 'chart.js/auto'

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
const { rangeData } = storeToRefs(intervalAnalyzeStore)

let chart = null

watch(
  () => props.data,
  () => {
    intervalAnalyzeStore.setRangeData(props.data)
    renderChart()
  },
)

function renderChart() {
  const result = countAllByRange(rangeData.value, props.type)
  const suffix = props.type === 'interval' ? '区间' : '尾数'
  const chartLine = chartPalette.chartLine

  chart = new Chart(document.getElementById(props.type), {
    type: 'line',
    data: {
      datasets: Object.keys(result).map((item, index) => ({
        label: `${item} ${suffix}`,
        borderWidth: 1,
        borderColor: chartLine[index],
        backgroundColor: chartLine[index],
        data: result[item],
      })),
    },
  })
}
</script>

<template>
  <canvas :id="props.type"></canvas>
</template>
