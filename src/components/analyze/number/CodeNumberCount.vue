<script setup>
/**
 * 这个组件用于统计n期内每个号码出现的次数
 * 绘制以下结构的数据：
 * [
 *   {
 *     '号码': {
 *       '出现次数': '号码个数',
 *       '期次': [期次...],
 *     },
 *   }
 * ]
 */
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCodeNumberCountStore } from '@/stores/code_number_count'
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

const codeNumberCountStore = useCodeNumberCountStore()
const { startData, lastData, codeStep, codeNumberData } =
  storeToRefs(codeNumberCountStore)
const description =
  '这部分用于统计最近n期内每个号码出现的次数，并以柱状图展示。'

watch(
  () => props.data,
  () => {
    codeNumberCountStore.setData(props.data)
    codeNumberCountStore.countNumberByCode(props.data)
    renderChart()
  },
)

watch(codeStep, () => {
  codeNumberCountStore.setData(props.data)
  codeNumberCountStore.countNumberByCode(props.data)
  chart.destroy()
  renderChart()
})

function renderChart() {
  const { tickColor, gridColor, labelColor, barColor } = chartPalette

  chart = new Chart(document.getElementById('code-number-count-chart'), {
    type: 'bar',
    data: {
      labels: codeNumberData.value.map((item) => item.num),
      datasets: [
        {
          label: '次数',
          data: codeNumberData.value.map((item) => item.count),
          backgroundColor: barColor,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          position: 'top',
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
            autoSkip: false, // 禁用自动跳过
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

    <p>共 {{ codeStep }} 期</p>
  </div>

  <canvas id="code-number-count-chart" height="700"></canvas>
</template>
