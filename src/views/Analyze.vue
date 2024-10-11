<script setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app.js'
import { getDataByNum } from '@/assets/js/request.js'
import { formatDay } from '@/assets/js/formatDay.js'
import { paletteLight, paletteDark } from '@/assets/js/palette.js'
import { getBallNum, countSubarrays, countDuplicates } from '@/assets/js/count.js'
import Chart from 'chart.js/auto'
import Ball from '@/components/content/Ball.vue'

const { isDark } = storeToRefs(useAppStore())

const tab = ref(null) // 选项卡

let chart = null // 图表实例
const LIGHT_GRID_COLOR = paletteLight.border // 亮色模式网格颜色
const LIGHT_DATA_COLOR = paletteLight['area-cold'] // 亮色模式数据颜色

const DARK_GRID_COLOR = paletteDark.border // 暗色模式网格颜色
const DARK_DATA_COLOR = paletteDark['area-cold'] // 暗色模式数据颜色

const dataList = ref([]) // 所有数据
const lastData = ref({}) // 最新期次数据

const ballCountCodes = ref(7) // 号码统计的期数
const ballCountData = ref([]) // 号码统计的区间数据

const ballCountStartCode = ref({}) // 号码统计的开始期次
const ballResultData = ref([]) // 号码统计的数据
const ballCountLeftArrowEnable = ref(true)
const ballCountRightArrowEnable = ref(true)

const intervalNum = ref(10) // 区间统计的分区范围
const intervalArea = ref([]) // 区间统计的区间
const currentData = ref({}) // 当前期次数据
const currentDataIndex = ref(0) // 当前期次数据下标
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
  }
]

// 切换主题后重绘图表
watch(isDark, () => {
  updateLineChart()
})

watch(currentDataIndex, () => {
  currentData.value = dataList.value[currentDataIndex.value];
})

watch(ballCountCodes, () => {
  checkBallCountArrowStatus()
})

watch(currentDataIndex, () => {
  checkAreaArrowStatus()
})

watch(ballCountCodes, () => {
  ballCountData.value = dataList.value.slice(0, ballCountCodes.value)
  ballCountStartCode.value = dataList.value[ballCountCodes.value - 1]
  countBall()
  chart.destroy()
  showBallCount()
})

watch([repeatCodes, repeatNum], () => {
  if (repeatNum.value > repeatCodes.value) {
    repeatNum.value = repeatCodes.value
  }
  repeatData.value = dataList.value.slice(0, repeatCodes.value)
  repeatStartData.value = dataList.value[repeatCodes.value - 1]
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
  updateLineChart()
})

function setIntervalArea(size) {
  const chunkedArray = [];
  const balls = Array.from({ length: 80 }, (_, index) => {
    const paddedIndex = index + 1 < 10 ? `0${index + 1}` : (index + 1).toString();
    return paddedIndex;
  });

  for (let i = 0; i < balls.length; i += size) {
    chunkedArray.push(balls.slice(i, i + size));
  }

  intervalArea.value = chunkedArray
}

function setIntervalAreaColor(index) {
  const ballNum = getBallNum(currentData.value)
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

  Object.values(currentData.value).forEach(item => {
    if (item === num) {
      isHot = true
    }
  })

  return isHot
}

function countRepeatBall() {
  const repeatBallList = []

  for (let i = 0; i < repeatData.value.length; i++) {
    const ballList = getBallNum(repeatData.value[i])

    repeatBallList.push({
      code: repeatData.value[i].code,
      list: ballList
    })
  }

  const result = countDuplicates(repeatBallList, repeatNum.value)

  repeatResultData.value = result
}

function countBall() {
  const data = new Array(80).fill(null).map((item, index) => ({ num: (index + 1).toString().padStart(2, '0'), count: 0 }));
  const ballList = ballCountData.value.map(item => getBallNum(item)).flatMap(item => item)

  data.forEach(obj => {
    obj.count = ballList.filter(item => item === obj.num).length
  })

  ballResultData.value = data
}

function showBallCount() {
  chart = new Chart(
    document.getElementById('my-canvas'), {
    type: 'line',
    data: {
      labels: ballResultData.value.map(row => row.num),
      datasets: [
        {
          label: '号码',
          borderWidth: 2,
          borderColor: LIGHT_DATA_COLOR,
          backgroundColor: LIGHT_DATA_COLOR,
          pointBackgroundColor: LIGHT_DATA_COLOR,
          data: ballResultData.value.map(row => row.count),
        }
      ]
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          ticks: {
            color: LIGHT_GRID_COLOR
          },
          grid: {
            color: LIGHT_GRID_COLOR
          }
        },
        y: {
          ticks: {
            color: LIGHT_GRID_COLOR
          },
          grid: {
            color: LIGHT_GRID_COLOR
          },
        }
      },
      plugins: {
        legend: {
          labels: {
            color: LIGHT_GRID_COLOR
          }
        }
      }
    }
  })
}

function updateLineChart() {
  const dataColor = isDark.value ? DARK_DATA_COLOR : LIGHT_DATA_COLOR
  const gridColor = isDark.value ? DARK_GRID_COLOR : LIGHT_GRID_COLOR

  const datasets = chart.data.datasets[0]
  datasets.borderColor = dataColor
  datasets.backgroundColor = dataColor
  datasets.pointBackgroundColor = dataColor

  const options = chart.options
  options.scales.x.grid.color = gridColor
  options.scales.x.ticks.color = gridColor
  options.scales.y.grid.color = gridColor
  options.scales.y.ticks.color = gridColor
  options.plugins.legend.labels.color = gridColor

  chart.update()
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

  if (ballCountCodes.value === dataList.value.length) {
    ballCountLeftArrowEnable.value = true
    ballCountRightArrowEnable.value = false
    return
  }

  ballCountLeftArrowEnable.value = true
  ballCountRightArrowEnable.value = true
}

function getNextData() {
  currentDataIndex.value -= 1;
}

function getPreviousData() {
  currentDataIndex.value += 1
}

function checkAreaArrowStatus() {
  if (currentDataIndex.value === 0) {
    areaRightArrowEnable.value = false
    areaLeftArrowEnable.value = true
    return
  }

  if (currentDataIndex.value === dataList.value.length - 1) {
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

  if (repeatCodes.value === dataList.value.length) {
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

  dataList.value = res.data.list

  lastData.value = res.data.list[0]
  currentData.value = res.data.list[currentDataIndex.value]

  ballCountData.value = res.data.list.slice(0, ballCountCodes.value)
  ballCountStartCode.value = res.data.list[ballCountCodes.value - 1]

  repeatData.value = res.data.list.slice(0, repeatCodes.value)
  repeatStartData.value = res.data.list[repeatCodes.value - 1]
}
</script>

<template>
  <main class="px-2 pb-2 text-text bg-background">
    <v-tabs align-tabs="center" v-model="tab">
      <v-tab value="one">号码分析</v-tab>
      <v-tab value="two">区域分析</v-tab>
      <v-tab value="three">重号分析</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="one">
        <div class="d-flex justify-space-between align-center py-3">
          <p>第{{ ballCountStartCode.code }}期 - 第{{ lastData.code }}期</p>
          <div class="d-flex justify-space-between align-center">
            <v-icon icon="keyboard_arrow_left" :disabled="!ballCountLeftArrowEnable" @click="reduceBallCountCodes" />
            <p>（共 {{ ballCountCodes }} 期）</p>
            <v-icon icon="keyboard_arrow_right" :disabled="!ballCountRightArrowEnable" @click="addBallCountCodes" />
          </div>
        </div>

        <canvas id="my-canvas" class="bg-background" width="100vw" height="600vh"></canvas>
      </v-tabs-window-item>

      <v-tabs-window-item value="two">
        <div class="d-flex justify-space-between align-center py-3">
          <v-icon icon="keyboard_arrow_left" :disabled="!areaLeftArrowEnable" @click="getPreviousData" />
          <div class="d-flex ga-6">
            <p>第{{ currentData.code }}期</p>
            <p>{{ formatDay(currentData.day) }}</p>
          </div>
          <v-icon icon="keyboard_arrow_right" :disabled="!areaRightArrowEnable" @click="getNextData" />
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
                <Ball v-for="num in area" :key="num" :num="num" :color="setHotBallBackgroundColor(num)" />
              </td>
            </tr>
          </tbody>
        </v-table>

        <div class="d-flex justify-space-around mt-2">
          <div class="d-flex align-center ga-2" v-for="category in intervalCategory" :key="category.title">
            <p>{{ category.title }}(&ge; {{ category.weight }}):</p>
            <p class="rounded area-color-box" :class="category.backgroundColor"></p>
          </div>
        </div>
      </v-tabs-window-item>

      <v-tabs-window-item value="three">
        <div class="d-flex justify-space-between align-center py-3">
          <p class="py-3">第{{ repeatStartData.code }}期 - 第{{ lastData.code }}期（共{{ repeatCodes }}期）</p>
          <v-icon icon="settings" size="16px" @click="toggleRepeatSetting" />
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
            <tr v-for="data in Object.keys(repeatResultData).sort((a, b) => a - b)" :key="data.code">
              <th scope="row">
                <Ball :num="data" />
              </th>
              <td>{{ repeatResultData[data].count }}</td>
              <td>
                <p v-for="code in repeatResultData[data].codes" :key="code">{{ code }}</p>
              </td>
            </tr>
          </tbody>
          <caption>只统计出现过{{ repeatNum }}次及以上的号码</caption>
        </v-table>

        <v-overlay v-model="showRepeatSetting" class="justify-center align-center">
          <div class="d-flex flex-column justify-center align-center ga-6 pa-6 rounded text-text bg-background">
            <h3>重号分析设置</h3>

            <div class="d-flex justify-space-between align-center ga-6">
              <p>统计的期次：</p>
              <div class="d-flex ga-8">
                <v-icon icon="keyboard_arrow_left" :disabled="!repeatCodesLeftArrowEnable" @click="reduceRepeatCodes" />
                <p>{{ repeatCodes }}</p>
                <v-icon icon="keyboard_arrow_right" :disabled="!repeatCodesRightArrowEnable" @click="addRepeatCodes" />
              </div>
            </div>

            <div class="d-flex justify-space-between align-center ga-6">
              <p>重复的次数：</p>
              <div class="d-flex ga-8">
                <v-icon icon="keyboard_arrow_left" :disabled="!repeatNumLeftArrowEnable" @click="reduceRepeatNum" />
                <p>{{ repeatNum }}</p>
                <v-icon icon="keyboard_arrow_right" :disabled="!repeatNumRightArrowEnable" @click="addRepeatNum" />
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
