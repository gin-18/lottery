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
import { ref, computed, watch } from 'vue'
import { paletteLight, chartLine } from '@/assets/js/palette'
import { getBallNum, countByFrequency } from '@/assets/js/count'
import { formatDay } from '@/assets/js/formatDay'
import Chart from 'chart.js/auto'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

let chart = null // 图表实例
const GRID_COLOR = paletteLight.border // 亮色模式网格颜色

const countData = ref([]) // 统计的数据
const startData = ref({}) // 开始期次
const lastData = ref({}) // 结束期次
const resultData = ref([])
const codeStep = ref(7) // 统计步长

const codes = computed(() => 13 + codeStep.value)
const startCode = computed(
  () => `第${startData.value.code}期\n${formatDay(startData.value.day)}`,
)
const lastCode = computed(
  () => `第${lastData.value.code}期\n${formatDay(lastData.value.day)}`,
)

watch(
  () => props.data,
  () => {
    startData.value = props.data[codes.value - 1]
    lastData.value = props.data[0]
    countData.value = props.data.slice(0, codes.value)
    setResultData()
    renderResultData()
  },
)

watch(codeStep, () => {
  startData.value = props.data[codes.value - 1]
  countData.value = props.data.slice(0, codes.value)
  setResultData()
  chart.destroy()
  renderResultData()
})

function countBall(arr) {
  const data = new Array(80).fill(null).map((item, index) => ({
    num: (index + 1).toString().padStart(2, '0'),
    count: 0,
  }))
  const ballList = arr.flatMap((item) => item)

  data.forEach((obj) => {
    obj.count = ballList.filter((item) => item === obj.num).length
  })

  return data
}

function setResultData() {
  resultData.value = sliceArray(countData.value, codeStep.value)
}

/**
 * 切割数组
 * @param {Array} arr
 * @param {Number} step
 * @returns {Array}
 */
function sliceArray(arr, step) {
  const result = []
  for (let i = 0; i < arr.length - step + 1; i++) {
    result.push({
      code: `第${arr[i + step - 1].code}期 - 第${arr[i].code}期`,
      list: countByFrequency(
        countBall(arr.slice(i, i + step).map((item) => getBallNum(item)), codeStep.value),
      ),
    })
  }
  return result
}

function renderResultData() {
  chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: {
      datasets: resultData.value.map((item, index) => ({
        label: `${item.code}`,
        borderWidth: 1,
        borderColor: chartLine[index],
        backgroundColor: chartLine[index],
        data: item.list.map((item) => Object.values(item)),
      })),
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

function addStep() {
  codeStep.value += 1
}

function reduceStep() {
  if (codeStep.value > 1) {
    codeStep.value -= 1
  }
}
</script>

<template>
  <div v-if="!data.length"></div>
  <div v-else>
    <div
      class="d-flex justify-space-between align-center w-100 font-weight-bold"
    >
      <p>共 {{ codes }} 期</p>
      <div class="d-flex align-center ga-8">
        <v-icon icon="fa fa-caret-left" size="16px" @click="reduceStep" />
        <p>步长: &nbsp; {{ codeStep }}</p>
        <v-icon icon="fa fa-caret-right" size="16px" @click="addStep" />
      </div>
    </div>

    <div class="d-flex align-center pt-4 pb-4">
      <div class="d-flex justify-space-between align-center ga-6 w-100">
        <p class="wrap">{{ startCode }}</p>
        <p>-</p>
        <p class="wrap">{{ lastCode }}</p>
      </div>
    </div>
  </div>

  <canvas id="chart" class="bg-background"></canvas>
</template>
