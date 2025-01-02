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
import { useFrequencyCountStore } from '@/stores/frequency_count'
import { chartPalette } from '@/assets/js/palette'
import Chart from 'chart.js/auto'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

let chart = null

const frequencyCountStore = useFrequencyCountStore()
const {
  startData,
  lastData,
  countStep,
  codes,
  frequencyGroupData,
  description,
} = storeToRefs(frequencyCountStore)

watch([() => props.data, countStep], () => {
  frequencyCountStore.setStartData(props.data)
  frequencyCountStore.setLastData(props.data)
  frequencyCountStore.countByFrequency(props.data)
  chart?.destroy()
  renderFrequencyGroupData()
})

function renderFrequencyGroupData() {
  const { tickColor, gridColor, labelColor, chartLine } = chartPalette

  chart = new Chart(document.getElementById('frequency-chart'), {
    type: 'line',
    data: {
      labels: frequencyGroupData.value.map((item) => Object.keys(item.list))[0],
      datasets: frequencyGroupData.value.map((item, index) => ({
        label: `${item.code}`,
        data: Object.values(item.list),
        borderWidth: 1,
        borderColor: chartLine[index],
        backgroundColor: chartLine[index],
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
  <div v-if="!data.length">
    <span class="loading loading-dots loading-sm"></span>
  </div>
  <div v-else>
    <p>{{ description }}</p>

    <div class="flex items-center gap-6">
      <CodeDate :data="startData" />
      <p>-</p>
      <CodeDate :data="lastData" />
    </div>

    <div class="self-end flex items-center gap-6">
      <p>共 {{ codes }} 期</p>
      <p>步长: {{ countStep }}</p>
    </div>
  </div>

  <canvas id="frequency-chart"></canvas>
</template>
