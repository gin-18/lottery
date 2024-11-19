<script setup>
import { ref, watch } from 'vue'
import { paletteLight } from '@/assets/js/palette.js'
import { getBallNum } from '@/assets/js/count.js'
import Chart from 'chart.js/auto'

let chart = null // 图表实例
const GRID_COLOR = paletteLight.border // 亮色模式网格颜色
const DATA_COLOR = paletteLight['area-cold'] // 亮色模式数据颜色

const lastData = ref({}) // 最新期次数据

const ballCountCodes = ref(7) // 号码统计的期数
const ballCountData = ref([]) // 号码统计的区间数据

const ballCountStartData = ref({}) // 号码统计的开始期次
const ballCountResultData = ref([]) // 号码统计的数据

const ballCountLeftArrowEnable = ref(true)
const ballCountRightArrowEnable = ref(true)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

watch(
  () => props.data,
  () => {
    lastData.value = props.data[0]
    ballCountData.value = props.data.slice(0, ballCountCodes.value)
    ballCountStartData.value = props.data[ballCountCodes.value - 1]
    countBall()
    showBallCount()
    checkBallCountArrowStatus()
  },
)

watch(ballCountCodes, (newValue) => {
  ballCountData.value = props.data.slice(0, newValue)
  ballCountStartData.value = props.data[newValue - 1]
  countBall()
  chart.destroy()
  showBallCount()
  checkBallCountArrowStatus()
})

function reduceBallCountCodes() {
  ballCountCodes.value -= 1
}

function addBallCountCodes() {
  ballCountCodes.value += 1
}

// 统计所有的号码出现的次数
function countBall() {
  const data = new Array(80).fill(null).map((item, index) => ({
    num: (index + 1).toString().padStart(2, '0'),
    count: 0,
  }))
  const ballList = ballCountData.value
    .map((item) => getBallNum(item))
    .flatMap((item) => item)

  data.forEach((obj) => {
    obj.count = ballList.filter((item) => item === obj.num).length
  })

  ballCountResultData.value = data
}

function checkBallCountArrowStatus() {
  if (ballCountCodes.value === 1) {
    ballCountLeftArrowEnable.value = false
    ballCountRightArrowEnable.value = true
    return
  }

  if (ballCountCodes.value === props.data.length) {
    ballCountLeftArrowEnable.value = true
    ballCountRightArrowEnable.value = false
    return
  }

  ballCountLeftArrowEnable.value = true
  ballCountRightArrowEnable.value = true
}

// 绘制号码统计后的折线图
function showBallCount() {
  chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      labels: ballCountResultData.value.map((row) => row.num),
      datasets: [
        {
          label: '号码出现次数',
          borderWidth: 2,
          borderColor: DATA_COLOR,
          backgroundColor: DATA_COLOR,
          pointBackgroundColor: DATA_COLOR,
          data: ballCountResultData.value.map((row) => row.count),
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
    <p>第{{ ballCountStartData.code }}期 - 第{{ lastData.code }}期</p>
    <div class="d-flex justify-space-between align-center">
      <v-icon
        icon="fa fa-caret-left"
        size="16px"
        :disabled="!ballCountLeftArrowEnable"
        @click="reduceBallCountCodes"
      />
      <p>（共 {{ ballCountCodes }} 期）</p>
      <v-icon
        icon="fa fa-caret-right"
        size="16px"
        :disabled="!ballCountRightArrowEnable"
        @click="addBallCountCodes"
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
