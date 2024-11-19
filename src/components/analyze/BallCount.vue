<script setup>
import { ref, watch } from 'vue'
import { getBallNum } from '@/assets/js/count.js'
import { paletteLight } from '@/assets/js/palette.js'
import Chart from 'chart.js/auto'

let chart = null // 图表实例
const GRID_COLOR = paletteLight.border // 亮色模式网格颜色
const DATA_COLOR = paletteLight['area-cold'] // 亮色模式数据颜色

const startData = ref({}) // 号码统计的开始期次
const lastData = ref({}) // 最新期次数据
const codeStep = ref(7) // 号码统计的期数
const countData = ref([]) // 号码统计的区间数据
const resultData = ref([]) // 号码统计的数据
const leftArrowEnable = ref(true)
const rightArrowEnable = ref(true)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

watch(
  () => props.data,
  () => {
    startData.value = props.data[codeStep.value - 1]
    lastData.value = props.data[0]
    countData.value = props.data.slice(0, codeStep.value)
    countBall()
    drawResultData()
    checkBallCountArrowStatus()
  },
)

watch(codeStep, (newValue) => {
  countData.value = props.data.slice(0, newValue)
  startData.value = props.data[newValue - 1]
  countBall()
  chart.destroy()
  drawResultData()
  checkBallCountArrowStatus()
})

function addCodeStep() {
  codeStep.value += 1
}

function reduceCodeStep() {
  codeStep.value -= 1
}

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

  resultData.value = data
}

function checkBallCountArrowStatus() {
  if (codeStep.value === 1) {
    leftArrowEnable.value = false
    rightArrowEnable.value = true
    return
  }

  if (codeStep.value === props.data.length) {
    leftArrowEnable.value = true
    rightArrowEnable.value = false
    return
  }

  leftArrowEnable.value = true
  rightArrowEnable.value = true
}

function drawResultData() {
  chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      labels: resultData.value.map((row) => row.num),
      datasets: [
        {
          label: '号码出现次数',
          borderWidth: 2,
          borderColor: DATA_COLOR,
          backgroundColor: DATA_COLOR,
          pointBackgroundColor: DATA_COLOR,
          data: resultData.value.map((row) => row.count),
        },
      ],
    },
    options: {
      indexAxis: 'y',
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
  <div v-if="!data.length"></div>
  <div v-else class="d-flex justify-space-between align-center py-6">
    <p>第{{ startData.code }}期 - 第{{ lastData.code }}期</p>
    <div class="d-flex justify-space-between align-center">
      <v-icon
        icon="fa fa-caret-left"
        size="16px"
        :disabled="!leftArrowEnable"
        @click="reduceCodeStep"
      />
      <p>（共 {{ codeStep }} 期）</p>
      <v-icon
        icon="fa fa-caret-right"
        size="16px"
        :disabled="!rightArrowEnable"
        @click="addCodeStep"
      />
    </div>
  </div>

  <canvas
    id="chart"
    class="bg-background"
    width="100vw"
    height="600vh"
  ></canvas>
</template>
