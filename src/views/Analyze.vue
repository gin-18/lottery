<script setup>
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app.js'
import { getDataByNum } from '@/assets/js/request.js'
import { formatDay } from '@/assets/js/formatDay.js'
import { paletteLight, paletteDark } from '@/assets/js/palette.js'
import { countSubarrays, countDuplicates } from '@/assets/js/count.js'
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
const currentData = ref({}) // 当前期次数据
const currentDataIndex = ref(0) // 当前期次数据下标
const rightArrowEnable = ref(true)
const leftArrowEnable = ref(true)

const intervalNum = ref(10) // 区间统计的分区范围
const intervalArea = ref([]) // 区间统计的区间

const repeatCodeNum = ref(2) // 重号统计的期数
const repeatNum = ref(2) // 重号统计的重号个数
const repeatData = ref([]) // 重号统计的区间数据
const repeatResultData = ref({}) // 重号统计的数据
const repeatStartCode = ref({}) // 重号统计的开始期次

const ballCountNum = ref(7) // 号码统计的期数
const ballCountData = ref([]) // 号码统计的区间数据
const ballCountStartCode = ref({}) // 号码统计的开始期次
const ballResultData = ref([]) // 号码统计的数据

const showBallCountSetting = ref(false)

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

watch(currentDataIndex, () => {
  checkArrowStatus()
})

watch(isDark, (newValue) => {
  const dataColor = newValue ? DARK_DATA_COLOR : LIGHT_DATA_COLOR
  const gridColor = newValue ? DARK_GRID_COLOR : LIGHT_GRID_COLOR

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
})

onMounted(async () => {
  const dataNum = ballCountNum.value > repeatCodeNum.value ? ballCountNum.value : repeatCodeNum.value
  await setData(dataNum)
  setIntervalAreaColor()
  setIntervalArea(intervalNum.value)
  countRepeatBall()
  countBall()
  checkArrowStatus()

  chart = showBallCount()
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

// 获取当前期次的号码
function getBallNum(obj) {
  const numberKey = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
  const ballList = []

  Object.keys(obj).forEach(item => {
    if (numberKey.includes(item)) {
      ballList.push(obj[item])
    }
  })

  return ballList
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
  return new Chart(
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

function checkArrowStatus() {
  if (currentDataIndex.value === 0) {
    rightArrowEnable.value = false
    leftArrowEnable.value = true
    return
  }

  if (currentDataIndex.value === dataList.value.length - 1) {
    leftArrowEnable.value = false
    rightArrowEnable.value = true
    return
  }

  leftArrowEnable.value = true
  rightArrowEnable.value = true
}

function getNextData() {
  currentDataIndex.value -= 1
  currentData.value = dataList.value[currentDataIndex.value]
}

function getPreviousData() {
  currentDataIndex.value += 1
  currentData.value = dataList.value[currentDataIndex.value]
}

function setBallCountSetting() {
  showBallCountSetting.value = !showBallCountSetting.value
}

async function setData(num) {
  const res = await getDataByNum(num)

  dataList.value = res.data.list

  lastData.value = res.data.list[0]
  currentData.value = res.data.list[currentDataIndex.value]

  repeatData.value = res.data.list.slice(0, repeatCodeNum.value)
  repeatStartCode.value = res.data.list[repeatNum.value - 1]

  ballCountData.value = res.data.list.slice(0, ballCountNum.value)
  ballCountStartCode.value = res.data.list[ballCountNum.value - 1]
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
          <p>第{{ ballCountStartCode.code }}期 - 第{{ lastData.code }}期（共{{ ballCountNum }}期）</p>
          <v-icon icon="settings" size="16px" @click="setBallCountSetting" />
        </div>
        <canvas id="my-canvas" class="bg-background" width="100vw" height="600vh"></canvas>
      </v-tabs-window-item>


      <v-tabs-window-item value="two">
        <div class="d-flex justify-space-between align-center py-3">
          <v-icon icon="keyboard_arrow_left" :disabled="!leftArrowEnable" @click="getPreviousData" />
          <div class="d-flex ga-6">
            <p>第{{ currentData.code }}期</p>
            <p>{{ formatDay(currentData.day) }}</p>
          </div>
          <v-icon icon="keyboard_arrow_right" :disabled="!rightArrowEnable" @click="getNextData" />
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
        <p class="py-3">第{{ repeatStartCode.code }}期 - 第{{ lastData.code }}期（共{{ repeatCodeNum }}期）</p>

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
