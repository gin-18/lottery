<script setup>
import { ref, watch, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request.js'
import { formatDay } from '@/assets/js/formatDay.js'
import { paletteLight } from '@/assets/js/palette.js'
import {
  getBallNum,
  countSubarrays,
  countDuplicates,
} from '@/assets/js/count.js'
import Chart from 'chart.js/auto'
import Header from '@/components/header/Header.vue'
import Ball from '@/components/content/Ball.vue'

const tab = ref(null) // 选项卡

let chart = null // 图表实例
const GRID_COLOR = paletteLight.border // 亮色模式网格颜色
const DATA_COLOR = paletteLight['area-cold'] // 亮色模式数据颜色

const allDataList = ref([]) // 所有数据
const lastData = ref({}) // 最新期次数据

const ballCountCodes = ref(7) // 号码统计的期数
const ballCountData = ref([]) // 号码统计的区间数据

const ballCountStartCode = ref({}) // 号码统计的开始期次
const ballResultData = ref([]) // 号码统计的数据
const ballCountLeftArrowEnable = ref(true)
const ballCountRightArrowEnable = ref(true)

const intervalNum = ref(10) // 区间统计的分区范围
const intervalArea = ref([]) // 区间统计的区间
const areaCurrentData = ref({}) // 当前期次数据
const areaCurrentDataIndex = ref(0) // 当前期次数据下标
const areaRightArrowEnable = ref(true)
const areaLeftArrowEnable = ref(true)

const repeatCodes = ref(2) // 重号统计的期数
const repeatNum = ref(2) // 重号统计的重号个数
const repeatData = ref([]) // 重号统计的区间数据
const repeatResultData = ref({}) // 重号统计的数据
const repeatStartData = ref({}) // 重号统计的开始期次
const showRepeatSetting = ref(false)
const repeatCodesLeftArrowEnable = ref(true)
const repeatCodesRightArrowEnable = ref(true)
const repeatNumLeftArrowEnable = ref(true)
const repeatNumRightArrowEnable = ref(true)

// TODO: 设置区间权重
const intervalCategory = [
  {
    title: '热',
    weight: 3,
    backgroundColor: 'bg-area-hot',
    textColor: 'text-area-hot',
  },
  {
    title: '温',
    weight: 2,
    backgroundColor: 'bg-area-warm',
    textColor: 'text-area-warm',
  },
  {
    title: '冷',
    weight: 0,
    backgroundColor: 'bg-area-cold',
    textColor: 'text-area-cold',
  },
]

watch(areaCurrentDataIndex, () => {
  areaCurrentData.value = allDataList.value[areaCurrentDataIndex.value]
  checkAreaArrowStatus()
})

watch(ballCountCodes, () => {
  checkBallCountArrowStatus()
})

watch(ballCountCodes, () => {
  ballCountData.value = allDataList.value.slice(0, ballCountCodes.value)
  ballCountStartCode.value = allDataList.value[ballCountCodes.value - 1]
  countBall()
  chart.destroy()
  showBallCount()
})

watch([repeatCodes, repeatNum], () => {
  if (repeatNum.value > repeatCodes.value) {
    repeatNum.value = repeatCodes.value
  }
  repeatData.value = allDataList.value.slice(0, repeatCodes.value)
  repeatStartData.value = allDataList.value[repeatCodes.value - 1]
  checkRepeatCodesArrowStatus()
  checkRepeatNumArrowStatus()
  countRepeatBall()
})

onMounted(async () => {
  await setData()
  setIntervalAreaColor()
  setIntervalArea(intervalNum.value)
  countRepeatBall()
  countBall()
  checkAreaArrowStatus()
  checkBallCountArrowStatus()
  checkRepeatCodesArrowStatus()
  showBallCount()
})

function setIntervalArea(size) {
  const chunkedArray = []
  const balls = Array.from({ length: 80 }, (_, index) => {
    const paddedIndex =
      index + 1 < 10 ? `0${index + 1}` : (index + 1).toString()
    return paddedIndex
  })

  for (let i = 0; i < balls.length; i += size) {
    chunkedArray.push(balls.slice(i, i + size))
  }

  intervalArea.value = chunkedArray
}

function setIntervalAreaColor(index) {
  const ballNum = getBallNum(areaCurrentData.value)
  const countObj = countSubarrays(intervalArea.value, ballNum)

  if (countObj[index] >= intervalCategory[0].weight) {
    return intervalCategory[0].textColor
  } else if (countObj[index] >= intervalCategory[1].weight) {
    return intervalCategory[1].textColor
  } else {
    return intervalCategory[2].textColor
  }
}

function setHotBallBackgroundColor(num) {
  return checkBallIsHot(num) ? 'bg-ball-hot' : 'bg-ball-cold'
}

function checkBallIsHot(num) {
  let isHot = false

  Object.values(areaCurrentData.value).forEach((item) => {
    if (item === num) {
      isHot = true
    }
  })

  return isHot
}

// 统计重复的号码
function countRepeatBall() {
  const repeatBallList = []

  for (let i = 0; i < repeatData.value.length; i++) {
    const ballList = getBallNum(repeatData.value[i])

    repeatBallList.push({
      code: repeatData.value[i].code,
      list: ballList,
    })
  }

  const result = countDuplicates(repeatBallList, repeatNum.value)

  repeatResultData.value = result
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

  ballResultData.value = data
}

function showBallCount() {
  chart = new Chart(document.getElementById('my-canvas'), {
    type: 'line',
    data: {
      labels: ballResultData.value.map((row) => row.num),
      datasets: [
        {
          label: '号码出现次数',
          borderWidth: 2,
          borderColor: DATA_COLOR,
          backgroundColor: DATA_COLOR,
          pointBackgroundColor: DATA_COLOR,
          data: ballResultData.value.map((row) => row.count),
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

function addBallCountCodes() {
  ballCountCodes.value += 1
}

function reduceBallCountCodes() {
  ballCountCodes.value -= 1
}

function checkBallCountArrowStatus() {
  if (ballCountCodes.value === 1) {
    ballCountLeftArrowEnable.value = false
    ballCountRightArrowEnable.value = true
    return
  }

  if (ballCountCodes.value === allDataList.value.length) {
    ballCountLeftArrowEnable.value = true
    ballCountRightArrowEnable.value = false
    return
  }

  ballCountLeftArrowEnable.value = true
  ballCountRightArrowEnable.value = true
}

function getNextData() {
  areaCurrentDataIndex.value -= 1
}

function getPreviousData() {
  areaCurrentDataIndex.value += 1
}

function checkAreaArrowStatus() {
  if (areaCurrentDataIndex.value === 0) {
    areaRightArrowEnable.value = false
    areaLeftArrowEnable.value = true
    return
  }

  if (areaCurrentDataIndex.value === allDataList.value.length - 1) {
    areaLeftArrowEnable.value = false
    areaRightArrowEnable.value = true
    return
  }

  areaLeftArrowEnable.value = true
  areaRightArrowEnable.value = true
}

function addRepeatCodes() {
  repeatCodes.value += 1
}

function reduceRepeatCodes() {
  repeatCodes.value -= 1
}

function addRepeatNum() {
  repeatNum.value += 1
}

function reduceRepeatNum() {
  repeatNum.value -= 1
}

function checkRepeatCodesArrowStatus() {
  if (repeatCodes.value === 1) {
    repeatCodesLeftArrowEnable.value = false
    repeatCodesRightArrowEnable.value = true
    return
  }

  if (repeatCodes.value === allDataList.value.length) {
    repeatCodesLeftArrowEnable.value = true
    repeatCodesRightArrowEnable.value = false
    return
  }

  repeatCodesLeftArrowEnable.value = true
  repeatCodesRightArrowEnable.value = true
}

function checkRepeatNumArrowStatus() {
  if (repeatNum.value === 1) {
    repeatNumLeftArrowEnable.value = false
    repeatNumRightArrowEnable.value = true
    return
  }

  if (repeatNum.value === repeatCodes.value) {
    repeatNumLeftArrowEnable.value = true
    repeatNumRightArrowEnable.value = false
    return
  }

  repeatNumLeftArrowEnable.value = true
  repeatNumRightArrowEnable.value = true
}

function toggleRepeatSetting() {
  showRepeatSetting.value = !showRepeatSetting.value
}

async function setData() {
  const res = await getDataByNum(100) // 获取近100期次的数据

  allDataList.value = res.data.list

  lastData.value = res.data.list[0]
  areaCurrentData.value = res.data.list[areaCurrentDataIndex.value]

  ballCountData.value = res.data.list.slice(0, ballCountCodes.value)
  ballCountStartCode.value = res.data.list[ballCountCodes.value - 1]

  repeatData.value = res.data.list.slice(0, repeatCodes.value)
  repeatStartData.value = res.data.list[repeatCodes.value - 1]
}
</script>

<template>
  <Header />
  <main class="px-3 pb-3 text-text bg-background">
    <v-tabs grow v-model="tab">
      <v-tab value="one">号码分析</v-tab>
      <v-tab value="two">区域分析</v-tab>
      <v-tab value="three">重号分析</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="one">
        <div class="d-flex justify-space-between align-center py-3">
          <p>第{{ ballCountStartCode.code }}期 - 第{{ lastData.code }}期</p>
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
          id="my-canvas"
          class="bg-background"
          width="100vw"
          height="600vh"
        ></canvas>
      </v-tabs-window-item>

      <v-tabs-window-item value="two">
        <div class="d-flex justify-space-between align-center py-3">
          <v-icon
            icon="fa fa-caret-left"
            size="16px"
            :disabled="!areaLeftArrowEnable"
            @click="getPreviousData"
          />
          <div class="d-flex ga-6">
            <p>第{{ areaCurrentData.code }}期</p>
            <p>{{ formatDay(areaCurrentData.day) }}</p>
          </div>
          <v-icon
            icon="fa fa-caret-right"
            size="16px"
            :disabled="!areaRightArrowEnable"
            @click="getNextData"
          />
        </div>

        <v-table class="border-border text-text bg-background">
          <thead>
            <tr>
              <th scope="col">区域</th>
              <th scope="col">号码</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(area, index) in intervalArea" :key="area">
              <td :class="setIntervalAreaColor(index)">
                [{{ area[0] }},{{ area[area.length - 1] }}]
              </td>
              <td class="d-flex align-center ga-1">
                <Ball
                  v-for="num in area"
                  :key="num"
                  :num="num"
                  :color="setHotBallBackgroundColor(num)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>

        <div class="d-flex justify-space-around mt-2">
          <div
            class="d-flex align-center ga-2"
            v-for="category in intervalCategory"
            :key="category.title"
          >
            <p>{{ category.title }}(&ge; {{ category.weight }}):</p>
            <p
              class="rounded area-color-box"
              :class="category.backgroundColor"
            ></p>
          </div>
        </div>
      </v-tabs-window-item>

      <v-tabs-window-item value="three">
        <div class="d-flex justify-space-between align-center py-3">
          <p class="py-3">
            第{{ repeatStartData.code }}期 - 第{{ lastData.code }}期（共{{
              repeatCodes
            }}期）
          </p>
          <v-icon icon="fa fa-gear" size="14px" @click="toggleRepeatSetting" />
        </div>

        <v-table class="border-border text-text bg-background">
          <thead>
            <tr>
              <th scope="col">号码</th>
              <th scope="col">出现次数</th>
              <th scope="col">出现期次</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="data in Object.keys(repeatResultData).sort(
                (a, b) => a - b,
              )"
              :key="data.code"
            >
              <th scope="row">
                <Ball :num="data" />
              </th>
              <td>{{ repeatResultData[data].count }}</td>
              <td>
                <p v-for="code in repeatResultData[data].codes" :key="code">
                  {{ code }}
                </p>
              </td>
            </tr>
          </tbody>
          <caption>
            只统计出现过{{
              repeatNum
            }}次及以上的号码
          </caption>
        </v-table>

        <v-overlay
          v-model="showRepeatSetting"
          class="justify-center align-center"
        >
          <div
            class="d-flex flex-column justify-center align-center ga-6 pa-6 rounded text-text bg-background"
          >
            <h3>重号分析设置</h3>

            <div class="d-flex justify-space-between align-center ga-6">
              <p>统计的期次：</p>
              <div class="d-flex align-center ga-8">
                <v-icon
                  icon="fa fa-caret-left"
                  size="16px"
                  :disabled="!repeatCodesLeftArrowEnable"
                  @click="reduceRepeatCodes"
                />
                <p>{{ repeatCodes }}</p>
                <v-icon
                  icon="fa fa-caret-right"
                  size="16px"
                  :disabled="!repeatCodesRightArrowEnable"
                  @click="addRepeatCodes"
                />
              </div>
            </div>

            <div class="d-flex justify-space-between align-center ga-6">
              <p>重复的次数：</p>
              <div class="d-flex align-center ga-8">
                <v-icon
                  icon="fa fa-caret-left"
                  size="16px"
                  :disabled="!repeatNumLeftArrowEnable"
                  @click="reduceRepeatNum"
                />
                <p>{{ repeatNum }}</p>
                <v-icon
                  icon="fa fa-caret-right"
                  size="16px"
                  :disabled="!repeatNumRightArrowEnable"
                  @click="addRepeatNum"
                />
              </div>
            </div>
          </div>
        </v-overlay>
      </v-tabs-window-item>
    </v-tabs-window>
  </main>
</template>

<style scoped>
.area-color-box {
  width: 18px;
  height: 18px;
}

th {
  font-weight: bold !important;
}

caption {
  caption-side: bottom;
}
</style>
