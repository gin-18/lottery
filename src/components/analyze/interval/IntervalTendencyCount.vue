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
import { watch, computed } from 'vue'
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

const typeText = computed(() => (props.type === 'interval' ? '区间' : '尾数'))

const intervalAnalyzeStore = useIntervalAnalyzeStore()
const { rangeData, rangeStep } = storeToRefs(intervalAnalyzeStore)

const description = `这部分用于统计各个${typeText.value}号码出现的次数，以及出现的次数趋势。`

let chart = null

watch([() => props.data, rangeStep], () => {
  intervalAnalyzeStore.setRangeData(props.data)
  chart?.destroy()
  renderChart()
})

function renderChart() {
  const result = countAllByRange(rangeData.value, props.type)
  const suffix = props.type === 'interval' ? '区间' : '尾数'
  const { gridColor, tickColor, labelColor, chartLine } = chartPalette

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
    options: {
      indexAxis: 'x',
      scales: {
        x: {
          ticks: {
            color: tickColor,
          },
          grid: {
            color: gridColor,
          },
        },
        y: {
          ticks: {
            color: tickColor,
          },
          grid: {
            color: gridColor,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: labelColor,
          },
        },
      },
    },
  })
}
</script>

<template>
  <p v-if="data.length">{{ description }}</p>
  <canvas :id="props.type"></canvas>
</template>
