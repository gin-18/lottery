<script setup>
import { ref, watch, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request.js'
import { formatDay } from '@/assets/js/formatDay.js'
import {
  getBallNum,
  countSubarrays,
  countDuplicates,
} from '@/assets/js/count.js'
import Header from '@/components/header/Header.vue'
import Ball from '@/components/content/Ball.vue'
import BallCount from '@/components/analyze/BallCount.vue'

const tab = ref(null) // 选项卡

const allDataList = ref([]) // 所有数据
const lastData = ref({}) // 最新期次数据

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
  checkAreaArrowStatus()
  checkRepeatCodesArrowStatus()
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

  repeatData.value = res.data.list.slice(0, repeatCodes.value)
  repeatStartData.value = res.data.list[repeatCodes.value - 1]
}
</script>

<template>
  <Header />
  <main class="px-3 pb-3 text-text bg-background">
    <v-tabs grow height="64px" v-model="tab">
      <v-tab value="one">号码分析</v-tab>
      <v-tab value="two">区域分析</v-tab>
      <v-tab value="three">重号分析</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="one">
        <BallCount :data="allDataList" />
      </v-tabs-window-item>

      <v-tabs-window-item value="two">
        <div class="d-flex justify-space-between align-center py-6">
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

        <div class="d-flex justify-space-around pt-3">
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
        <div class="d-flex justify-space-between align-center py-6">
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
          <caption class="pt-3">
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
