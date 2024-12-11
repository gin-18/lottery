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
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFrequencyAnalyzeStore } from '@/stores/frequency_analyze'
import { chartPalette } from '@/assets/js/palette'
import Chart from 'chart.js/auto'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

let chart = null // 图表实例

const frequencyAnalyzeStore = useFrequencyAnalyzeStore()
const { startData, lastData, resultData, codeStep, codes } = storeToRefs(
  frequencyAnalyzeStore,
)
const description =
  '这一部分用于统计指定步长的期次的所有号码出现的次数的总个数, 例如：步长为7的情况下, 则以每7期作为一组数据，统计这一组数据中，出现0次的号码有多少个，出现1次的号码有多少个，以此类推，总共统计14组数据。'

watch(
  () => props.data,
  () => {
    frequencyAnalyzeStore.setStartData(props.data)
    frequencyAnalyzeStore.setLastData(props.data)
    frequencyAnalyzeStore.setResultData(props.data)

    renderResultData()
  },
)

watch(codeStep, () => {
  frequencyAnalyzeStore.setStartData(props.data)
  frequencyAnalyzeStore.setLastData(props.data)
  frequencyAnalyzeStore.setResultData(props.data)

  chart.destroy()
  renderResultData()
})

function renderResultData() {
  const baseColor = chartPalette.baseColor
  const chartLine = chartPalette.chartLine

  chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      labels: resultData.value.map((item) => Object.keys(item.list))[0],
      datasets: resultData.value.map((item, index) => ({
        label: `${item.code}`,
        borderWidth: 1,
        borderColor: chartLine[index],
        backgroundColor: chartLine[index],
        data: Object.values(item.list),
      })),
    },
    options: {
      indexAxis: 'x',
      scales: {
        x: {
          ticks: {
            color: baseColor,
          },
          grid: {
            color: baseColor,
          },
        },
        y: {
          ticks: {
            color: baseColor,
          },
          grid: {
            color: baseColor,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: baseColor,
          },
        },
      },
    },
  })
}
</script>

<template>
  <div v-if="!data.length"></div>
  <div v-else>
    <div class="flex items-center gap-6">
      <CodeDate :data="startData" />
      <p>-</p>
      <CodeDate :data="lastData" />
    </div>

    <div class="self-end flex items-center gap-6">
      <p>共 {{ codes }} 期</p>
      <p>步长: {{ codeStep }}</p>
    </div>

    <p>{{ description }}</p>
  </div>

  <canvas id="chart"></canvas>
</template>
