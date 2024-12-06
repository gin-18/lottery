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
import { chartLine } from '@/assets/js/palette'
import { formatData, countByFrequency } from '@/assets/js/count'
import Chart from 'chart.js/auto'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

let chart = null // 图表实例
const GRID_COLOR = '#000' // 亮色模式网格颜色

const countData = ref([]) // 统计的数据
const startData = ref({}) // 开始期次
const lastData = ref({}) // 结束期次
const resultData = ref([])
const codeStep = ref(7) // 统计步长

const codes = computed(() => 13 + codeStep.value)

const description =
  '这一部分用于统计指定步长的期次的所有号码出现的次数的总个数, 例如：步长为7的情况下, 则以每7期作为一组数据，统计这一组数据中，出现0次的号码有多少个，出现1次的号码有多少个，以此类推，总共统计14组数据。'

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
        countBall(arr.slice(i, i + step).map((item) => formatData(item).balls)),
        codeStep.value,
      ),
    })
  }
  return result
}

function renderResultData() {
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
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-6">
          <CodeDate :data="startData" />
          <p>-</p>
          <CodeDate :data="lastData" />
        </div>
        <p>共 {{ codes }} 期</p>
      </div>

      <div class="flex items-center gap-4">
        <span
          class="icon-[octicon--triangle-left-24]"
          @click="reduceStep"
        ></span>
        <p>步长: &nbsp; {{ codeStep }}</p>
        <span class="icon-[octicon--triangle-right-24]" @click="addStep"></span>
      </div>
    </div>
  </div>

  <p class="py-6">{{ description }}</p>

  <canvas id="chart"></canvas>
</template>
