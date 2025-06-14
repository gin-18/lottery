<script setup>
/**
 * 这个组件用于统计每指定期次的号码出现的各种次数的总个数
 * 设置每几期统计一个 -- 统计步长
 * 统计的数据：期次 - 步长 + 1
 * 共统计14组数据
 * 渲染的数据：
 * [
 *   {
 *      '期次': '第i期 - 第i + step期',
 *      '统计': [{
 *        '出现i数': '号码个数',
 *      }]
 *   }
 * ]
 */
import { inject, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberFrequencyStatisticsStore } from '@/stores/number-statistics/number-frequency-statistics'
import echarts from '@/assets/js/echarts'
import { chartPalette } from '@/assets/js/palette'
import CodeDate from '@/components/content/CodeDate.vue'

const numberFrequencyStatisticsStore = useNumberFrequencyStatisticsStore()
const { startCode, lastCode, codeStep, codes, result, description } =
  storeToRefs(numberFrequencyStatisticsStore)

const rawDataArray = inject('rawDataArray')

let chart = null

watch(codeStep, loadFrequencyCount)

onMounted(loadFrequencyCount)

onUnmounted(() => {
  chart?.dispose?.()
  chart = null
})

function loadFrequencyCount() {
  numberFrequencyStatisticsStore.initData(rawDataArray.value)
  numberFrequencyStatisticsStore.countByFrequency(rawDataArray.value)
  renderFrequencyGroupData()
}

function renderFrequencyGroupData() {
  chart?.dispose?.()
  chart = null

  const legendData = result.value.map((item) => item.code)
  const xAxisData = Object.keys(result.value[0].list)
  const seriesData = result.value.map((item) => ({
    name: item.code,
    type: 'line',
    data: Object.values(item.list),
  }))

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
      data: xAxisData,
    },
    yAxis: {
      type: 'value',
    },
    series: seriesData,
  }

  chart = echarts.init(document.getElementById('frequency-chart'))

  chart.setOption(options)
}
</script>

<template>
  <p>{{ description }}</p>
  <CodeDate v-if="startCode && lastCode" :data="[startCode, lastCode]" />
  <div class="self-end flex items-center gap-6">
    <p>共 {{ codes }} 期</p>
    <p>步长: {{ codeStep }}</p>
  </div>
  <div id="frequency-chart" class="w-full h-[400px]"></div>
</template>
