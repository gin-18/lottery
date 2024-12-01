<script setup>
/*
 * 这个组件用于统计每指定期次的号码出现的各种次数的总个数
 */
import { ref, computed, watch } from 'vue'
import { paletteLight } from '@/assets/js/palette'
import { getBallNum, countByFrequency } from '@/assets/js/count'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

let chart = null // 图表实例
const GRID_COLOR = paletteLight.border // 亮色模式网格颜色
const DATA_COLOR = paletteLight['area-cold'] // 亮色模式数据颜色

const resultData = ref([])
const countData = ref([]) // 统计的数据
const startIndex = ref(6) // 开始期次下标
const endIndex = ref(0) // 结束期次下标

const codes = computed(() => startIndex.value - endIndex.value + 1) // 每几期统计统计一次

watch(
  () => props.data,
  () => {
    countData.value = props.data.slice(endIndex, startIndex.value + 1)
    setResultData()
    drawResultData()
  },
)

function countBall() {
  const data = new Array(80).fill(null).map((item, index) => ({
    num: (index + 1).toString().padStart(2, '0'),
    count: 0,
  }))
  const ballList = countData.value
    .map((item) => getBallNum(item))
    .flatMap((item) => item)

  data.forEach((obj) => {
    obj.count = ballList.filter((item) => item === obj.num).length
  })

  return data
}

function setResultData() {
  resultData.value = countByFrequency(countBall())
}

function drawResultData() {
  chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      labels: resultData.value.map((item) => Object.keys(item)[0]),
      datasets: [
        {
          label: '号码出现次数',
          borderWidth: 2,
          borderColor: DATA_COLOR,
          backgroundColor: DATA_COLOR,
          pointBackgroundColor: DATA_COLOR,
          data: resultData.value.map((item, index) => item[index]),
        },
      ],
    },
    options: {
      indexAxis: 'x',
      scales: {
        x: {
          ticks: {
            color: GRID_COLOR,
          },
          grid: {
            color: GRID_COLOR,
          },
        },
        y: {
          ticks: {
            color: GRID_COLOR,
          },
          grid: {
            color: GRID_COLOR,
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: GRID_COLOR,
          },
        },
      },
    },
  })
}
</script>

<template>
  <canvas id="chart" class="bg-background"></canvas>
</template>
