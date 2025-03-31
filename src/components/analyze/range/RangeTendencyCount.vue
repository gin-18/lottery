<script setup>
import { watch, onUnmounted } from 'vue'
import echarts from '@/assets/js/echarts'
import { chartPalette } from '@/assets/js/palette'

const props = defineProps({
  chartId: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
    required: true,
  },
  codeStep: {
    type: Number,
    required: true,
  },
  result: {
    type: [Object, null],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

let chart = null

watch([() => props.result, () => props.codeStep], renderChart)

onUnmounted(() => {
  chart?.dispose?.()
  chart = null
})

function renderChart() {
  chart?.dispose?.()
  chart = null

  const { result = {}, suffix = '' } = props

  const resultEntries = Object.entries(result)
  if (resultEntries.length === 0) return

  const [legendData, seriesData, xAxisData] = resultEntries.reduce(
    (acc, [key, value]) => {
      // legend数据
      acc[0].push(`${key}${suffix}`)

      // series数据
      const timesData = Object.values(value || {})
        .reverse()
        .map((data) => data?.times ?? null)
      acc[1].push({
        name: `${key}${suffix}`,
        type: 'line',
        data: timesData,
      })

      // xAxis数据（只取第一个元素的keys）
      if (acc[2].length === 0) {
        acc[2] = Object.keys(value || {}).reverse()
      }

      return acc
    },
    Array.from({ length: 3 }, () => []),
  )

  const options = {
    color: chartPalette.chartLine,
    grid: {
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      type: 'scroll',
      data: legendData,
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 10,
      },
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
    },
    series: seriesData,
  }

  chart = echarts.init(document.getElementById(props.chartId))

  chart.setOption(options)
}
</script>

<template>
  <p>{{ description }}</p>
  <div :id="chartId" class="w-full h-[400px]"></div>
</template>
