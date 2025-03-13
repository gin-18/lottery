<script setup>
import { watch, onUnmounted } from 'vue'
import echarts from '@/assets/js/echarts'
import { chartPalette } from '@/assets/js/palette'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  chartId: {
    type: String,
    required: true,
  },
  codeStep: {
    type: Number,
    required: true,
  },
  startCode: {
    type: Object,
    required: true,
  },
  endCode: {
    type: Object,
    required: true,
  },
  result: {
    type: Object,
    required: true,
  },
  description: {
    type: String,
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

  const { result = {} } = props
  const xAxisData = Object.keys(result)
  const seriesData = {
    type: 'bar',
    data: Object.values(result),
  }

  const options = {
    color: chartPalette.chartLine,
    grid: {
      top: '8%',
      left: '0%',
      right: '0%',
      bottom: '0%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
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
  <CodeDate :data="[startCode, endCode]" />
  <p>共 {{ codeStep }} 期</p>
  <div :id="chartId" class="w-full h-[400px]"></div>
</template>
