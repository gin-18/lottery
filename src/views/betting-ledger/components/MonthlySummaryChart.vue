<script setup>
import { nextTick, onUnmounted, watch } from 'vue'
import echarts from '@/charts/echarts'
import { chartPalette } from '@/charts/palette'

const props = defineProps({
  chartId: {
    type: String,
    required: true,
  },
  stats: {
    type: Array,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
})

let chart = null

watch([() => props.stats, () => props.isVisible], renderChart, { deep: true })

onUnmounted(() => {
  disposeChart()
})

async function renderChart() {
  if (!props.isVisible) return

  await nextTick()
  const chartElement = document.getElementById(props.chartId)
  if (!chartElement) return

  disposeChart()
  chart = echarts.init(chartElement)
  chart.setOption(getChartOptions())
}

function disposeChart() {
  chart?.dispose?.()
  chart = null
}

function getChartOptions() {
  return {
    color: [chartPalette.chartLine[1], chartPalette.chartLine[2], chartPalette.chartLine[0]],
    grid: {
      top: 64,
      left: 0,
      right: 8,
      bottom: 0,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `¥${Number(value).toFixed(2)}`,
    },
    legend: {
      top: 8,
      data: ['投注成本', '中奖金额', '营收'],
    },
    xAxis: {
      type: 'category',
      data: props.stats.map((item) => item.label),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      getBarSeries('投注成本', 'stakeAmount'),
      getBarSeries('中奖金额', 'prizeAmount'),
      getLineSeries(),
    ],
  }
}

function getBarSeries(name, fieldName) {
  return {
    name,
    type: 'bar',
    data: props.stats.map((item) => item[fieldName]),
  }
}

function getLineSeries() {
  return {
    name: '营收',
    type: 'line',
    data: props.stats.map((item) => item.revenue),
    smooth: true,
  }
}
</script>

<template>
  <div :id="chartId" class="h-[360px] w-full"></div>
</template>
