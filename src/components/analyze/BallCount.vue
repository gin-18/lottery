<script setup>
import { ref, computed, watch } from 'vue'
import { getBallNum } from '@/assets/js/count'
import { formatDay } from '@/assets/js/formatDay'
import { paletteLight } from '@/assets/js/palette'
import Chart from 'chart.js/auto'

let chart = null // 图表实例
const GRID_COLOR = paletteLight.border // 亮色模式网格颜色
const DATA_COLOR = paletteLight['area-cold'] // 亮色模式数据颜色

const showSetting = ref(false)
const startData = ref({}) // 开始期次
const endData = ref({}) // 结束期次
const startIndex = ref(6) // 开始期次下标
const endIndex = ref(0) // 结束期次下标
const countData = ref([]) // 统计的数据
const resultData = ref([]) // 统计后的数据

const startAddArrowStatus = ref(false)
const startReduceArrowStatus = ref(false)
const endAddArrowStatus = ref(false)
const endReduceArrowStatus = ref(false)

const codeStep = computed(() => startIndex.value - endIndex.value + 1)
const startCode = computed(
  () => `第${startData.value.code}期\n${formatDay(startData.value.day)}`,
)
const endCode = computed(
  () => `第${endData.value.code}期\n${formatDay(endData.value.day)}`,
)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

watch(
  () => props.data,
  () => {
    startData.value = props.data[startIndex.value]
    endData.value = props.data[endIndex.value]
    countData.value = props.data.slice(endIndex.value, startIndex.value + 1)
    countBall()
    drawResultData()
    checkBallCountArrowStatus()
  },
)

watch([startIndex, endIndex], (newValue) => {
  startData.value = props.data[newValue[0]]
  endData.value = props.data[newValue[1]]
  countData.value = props.data.slice(newValue[1], newValue[0] + 1)
  countBall()
  chart.destroy()
  drawResultData()
  checkBallCountArrowStatus()
})

function addStartCode() {
  if (startIndex.value >= props.data.length - 1) return
  startIndex.value += 1
}

function reduceStartCode() {
  if (startIndex.value <= endIndex.value) return
  startIndex.value -= 1
}

function addEndCode() {
  if (startIndex.value <= endIndex.value) return
  endIndex.value += 1
}

function reduceEndCode() {
  if (endIndex.value <= 0) return
  endIndex.value -= 1
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
  startAddArrowStatus.value = false
  startReduceArrowStatus.value = false
  endAddArrowStatus.value = false
  endReduceArrowStatus.value = false

  if (startIndex.value >= props.data.length - 1) {
    startAddArrowStatus.value = true
  } else if (startIndex.value <= endIndex.value) {
    startReduceArrowStatus.value = true
    endAddArrowStatus.value = true
  } else if (endIndex.value <= 0) {
    endReduceArrowStatus.value = true
  }
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

function toggleSetting() {
  showSetting.value = !showSetting.value
}
</script>

<template>
  <div v-if="!data.length"></div>
  <div v-else>
    <div class="d-flex justify-space-between align-center w-100 pt-4">
      <p class="font-weight-bold">共 {{ codeStep }} 期</p>
      <v-icon icon="fa fa-gear" size="16px" @click="toggleSetting" />
    </div>

    <div class="d-flex align-center py-4">
      <div class="d-flex justify-space-between align-center ga-6 w-100">
        <p class="wrap">{{ startCode }}</p>
        <p>-</p>
        <p class="wrap">{{ endCode }}</p>
      </div>
    </div>
  </div>
  <canvas
    id="chart"
    class="bg-background"
    width="100vw"
    height="600vh"
  ></canvas>

  <v-overlay v-model="showSetting" class="justify-center align-center">
    <div class="d-flex flex-column ga-8 pa-6 rounded text-text bg-background">
      <h2 class="text-h6 font-weight-bold">号码统计设置</h2>

      <p>共 {{ codeStep }} 期</p>

      <div>
        <h3 class="pb-3 text-body-1">起始期次：</h3>
        <div class="d-flex justify-space-between align-center ga-12">
          <v-icon
            icon="fa fa-caret-left"
            size="18px"
            :disabled="startAddArrowStatus"
            @click="addStartCode"
          />
          <p class="wrap">{{ startCode }}</p>
          <v-icon
            icon="fa fa-caret-right"
            size="18px"
            :disabled="startReduceArrowStatus"
            @click="reduceStartCode"
          />
        </div>
      </div>

      <div>
        <h3 class="pb-3 text-body-1">结束期次：</h3>
        <div class="d-flex justify-space-between align-center ga-12">
          <v-icon
            icon="fa fa-caret-left"
            size="18px"
            :disabled="endAddArrowStatus"
            @click="addEndCode"
          />
          <p class="wrap">{{ endCode }}</p>
          <v-icon
            icon="fa fa-caret-right"
            size="18px"
            :disabled="endReduceArrowStatus"
            @click="reduceEndCode"
          />
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<style scoped>
.wrap {
  white-space: pre;
}
</style>
