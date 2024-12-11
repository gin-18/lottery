<script setup>
import { ref, watch } from 'vue'
import {
  generateBallInterval,
  generateBallTailInterval,
  countAllByRange,
  countOneByRange,
} from '@/assets/js/count'
import { chartPalette } from '@/assets/js/palette'
import Chart from 'chart.js/auto'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

let chart = null
const partitionStep = ref(10) // 区间统计的步长
const ballInterval = ref([]) // 号码区间
const ballTailInterval = ref([]) // 号码尾数区间
const currentData = ref({}) // 当前期次数据
const rangeData = ref({}) // 多期次数据
const rangeStep = ref(21) // 多期次数据步长
const currentDataIndex = ref(0) // 当前期次数据下标
const codeAddArrowStatus = ref(false)
const codeReduceArrowStatus = ref(false)

const description =
  '这一部分以10为步长，划分80个开奖号码，得到8个区间。统计每个区间内，开奖号码出现的情况，并根据每个区间开奖号码的个数划分为热，温，冷。'

const intervalCategory = ref([
  {
    title: '热',
    weight: 3,
    backgroundColor: 'bg-error',
    textColor: 'text-error',
  },
  {
    title: '温',
    weight: 2,
    backgroundColor: 'bg-warning',
    textColor: 'text-warning',
  },
  {
    title: '冷',
    weight: 0,
    backgroundColor: 'bg-primary',
    textColor: 'text-primary',
  },
])

watch(
  () => props.data,
  () => {
    ballInterval.value = generateBallInterval(partitionStep.value)
    ballTailInterval.value = generateBallTailInterval()
    setCurrentData(currentDataIndex.value)
    setRangeData()
    renderChart('interval')
    renderChart('tail')
    checkCodeArrowStatus()
  },
)

watch(currentDataIndex, (newValue) => {
  setCurrentData(newValue)
  setRangeData()
  chart.destroy()
  checkCodeArrowStatus()
})

function goNextCode() {
  currentDataIndex.value -= 1
}

function goPreviousCode() {
  currentDataIndex.value += 1
}

function addWeight(index) {
  intervalCategory.value[index].weight += 1
}

function reduceWeight(index) {
  intervalCategory.value[index].weight -= 1
}

function setHotBallBackgroundColor(num) {
  return checkBallIsHot(num) ? 'bg-error' : 'bg-base-300'
}

function checkBallIsHot(num) {
  let isHot = false

  Object.values(currentData.value).forEach((item) => {
    if (item === num) {
      isHot = true
    }
  })

  return isHot
}

function setIntervalColor(index, type) {
  const countObj = countOneByRange(currentData.value, type)
  const intervalValue = Object.values(countObj.data)[index]

  if (intervalValue >= intervalCategory.value[0].weight) {
    return intervalCategory.value[0].textColor
  } else if (intervalValue >= intervalCategory.value[1].weight) {
    return intervalCategory.value[1].textColor
  } else {
    return intervalCategory.value[2].textColor
  }
}

/**
 * 绘制的数据：
 * {
 *   'range': {
 *     'code1': times,
 *     'code2': times,
 *   },
 *   ...
 * }
 **/
function renderChart(type) {
  const result = countAllByRange(rangeData.value, type)
  const suffix = type === 'tail' ? '尾数' : '区间'
  const chartLine = chartPalette.chartLine

  chart = new Chart(document.getElementById(type), {
    type: 'line',
    data: {
      datasets: Object.keys(result).map((item, index) => ({
        label: `${item} ${suffix}`,
        borderWidth: 1,
        borderColor: chartLine[index],
        backgroundColor: chartLine[index],
        data: result[item],
      })),
    },
  })
}

function setCurrentData(index) {
  currentData.value = props.data[index]
}

function setRangeData() {
  rangeData.value = props.data.slice(0, rangeStep.value)
}

function checkCodeArrowStatus() {
  codeAddArrowStatus.value = false
  codeReduceArrowStatus.value = false

  if (currentDataIndex.value <= 0) {
    codeAddArrowStatus.value = true
  } else if (currentDataIndex.value >= props.data.length - 1) {
    codeReduceArrowStatus.value = true
  }
}

function checkAddWeightArrowStatus(index) {
  if (index === 2) return

  const weights = intervalCategory.value.map((item) => item.weight)
  return index === 0
    ? weights[index] >= partitionStep.value
    : weights[index] >= weights[index - 1] - 1
}

function checkReduceWeightArrowStatus(index) {
  if (index === 2) return

  const weights = intervalCategory.value.map((item) => item.weight)
  return weights[index] <= weights[index + 1] + 1
}
</script>

<template>
  <div v-if="!data.length"></div>
  <div v-else>
    <div class="flex justify-between items-center">
      <CodeDate :data="currentData" />
      <button
        class="icon-[octicon--gear-24]"
        onclick="my_modal_2.showModal()"
      ></button>
    </div>

    <p class="py-6">{{ description }}</p>

    <div>
      <h2 class="">各区域开奖情况</h2>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">区域</th>
            <th scope="col">号码</th>
            <th scope="col">次数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(interval, index) in ballInterval" :key="interval">
            <td :class="setIntervalColor(index, 'interval')">
              [{{ interval[0] }},{{ interval[interval.length - 1] }}]
            </td>
            <td class="flex gap-2">
              <Ball
                v-for="num in interval"
                :key="num"
                :num="num"
                :color="setHotBallBackgroundColor(num)"
              />
            </td>
            <td>
              {{
                Object.values(countOneByRange(currentData, 'interval').data)[
                  index
                ]
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>
      <h2 class="">各尾部开奖情况</h2>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">尾号</th>
            <th scope="col">号码</th>
            <th scope="col">次数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(interval, index) in ballTailInterval" :key="interval">
            <td :class="setIntervalColor(index, 'tail')">
              {{ interval[0].slice(-1) }}
            </td>
            <td class="flex gap-2">
              <Ball
                v-for="num in interval"
                :key="num"
                :num="num"
                :color="setHotBallBackgroundColor(num)"
              />
            </td>
            <td>
              {{
                Object.values(countOneByRange(currentData, 'tail').data)[index]
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog id="my_modal_2" class="modal">
      <div class="modal-box">
        <h2>区域分析设置</h2>

        <div class="pb-6">
          <h3>期次：</h3>
          <div class="flex justify-between items-center">
            <button
              class="btn"
              :class="{ 'btn-disabled': codeReduceArrowStatus }"
              @click="goPreviousCode"
            >
              <span class="icon-[octicon--triangle-left-24]"></span>
            </button>
            <CodeDate :data="currentData" />
            <button
              class="btn"
              :class="{ 'btn-disabled': codeAddArrowStatus }"
              @click="goNextCode"
            >
              <span class="icon-[octicon--triangle-right-24]"></span>
            </button>
          </div>
        </div>

        <div
          v-for="(category, index) in intervalCategory"
          :class="{ 'pb-6': index !== 2 }"
          :key="index"
        >
          <h3 v-if="index !== 2">{{ category.title }}区权重：</h3>
          <div v-if="index !== 2" class="flex justify-between items-center">
            <button
              class="btn"
              :class="{ 'btn-disabled': checkReduceWeightArrowStatus(index) }"
              @click="reduceWeight(index)"
            >
              <span class="icon-[octicon--triangle-left-24]"></span>
            </button>
            <p>
              {{ intervalCategory[index].weight.toString().padStart(2, '0') }}
            </p>
            <button
              class="btn"
              :class="{ 'btn-disabled': checkAddWeightArrowStatus(index) }"
              @click="addWeight(index)"
            >
              <span class="icon-[octicon--triangle-right-24]"></span>
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div
            class="flex items-center gap-2"
            v-for="(category, index) in intervalCategory"
            :key="index"
          >
            <p>
              {{ category.title }}(&ge;
              {{ category.weight.toString().padStart(2, '0') }}):
            </p>
            <p class="w-4 h-4 rounded" :class="category.backgroundColor"></p>
          </div>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>

  <div>
    <h2 class="text-h6 font-weight-bold py-6">区域频率统计</h2>
    <canvas id="interval" class="bg-background"></canvas>
  </div>

  <div>
    <h2 class="text-h6 font-weight-bold py-6">尾部频率统计</h2>
    <canvas id="tail" class="bg-background"></canvas>
  </div>
</template>
