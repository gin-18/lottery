<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum, getDataByCode } from '@/assets/js/request.js'
import { formatDay } from '@/assets/js/formatDay.js'
import { countSubarrays, countDuplicates } from '@/assets/js/count.js'
import SingleTitle from '@/components/content/SingleTitle.vue'
import Ball from '@/components/content/Ball.vue'
import Dougnut from '@/components/content/Dougnut.vue'

const intervalNum = ref(10) // 区间统计的分区范围
const intervalArea = ref([]) // 区间统计的区间

const repeatCodeNum = ref(3) // 重号统计的期数
const repeatNum = ref(2) // 重号统计的重号个数
// TODO: 设置在store中
const currentData = ref({}) // 当前期次

const repeatArea = ref([]) // 重号统计的区间数据
const repeatStartCode = ref({}) // 重号统计的开始期次
const repeatEndCode = ref({}) // 重号统计的结束期次
const repeatData = ref({}) // 重号统计的数据

// TODO: 设置区间权重
const intervalCategory = [
  {
    title: '热',
    weight: 3,
    backgroundColor: 'bg-ctp-red',
    textColor: 'text-ctp-red',
  },
  {
    title: '温',
    weight: 2,
    backgroundColor: 'bg-ctp-yellow',
    textColor: 'text-ctp-yellow',
  },
  {
    title: '冷',
    weight: 0,
    backgroundColor: 'bg-ctp-sky',
    textColor: 'text-ctp-sky',
  }
]

onMounted(async () => {
  await setData(repeatCodeNum.value)
  setIntervalAreaColor()
  countRepeatBall()
  setIntervalArea(intervalNum.value)
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
  return checkBallIsHot(num) ? 'bg-ctp-red' : 'bg-ctp-surface0'
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

  for (let i = 0; i < repeatArea.value.length; i++) {
    const ballList = getBallNum(repeatArea.value[i])

    repeatBallList.push({
      code: repeatArea.value[i].code,
      list: ballList
    })
  }

  const result = countDuplicates(repeatBallList, repeatNum.value)

  repeatData.value = result
}

async function setData(num) {
  const res = await getDataByNum(num)

  currentData.value = res.last
  repeatArea.value = res.data.list
  repeatStartCode.value = res.data.list[res.data.list.length - 1]
  repeatEndCode.value = res.data.list[0]
}
</script>

<template>
  <main class="flex flex-col gap-8 p-3">
    <div class="flex flex-col gap-3">
      <SingleTitle title="区域统计" />

      <div class="flex gap-6">
        <p class="text-ctp-text">第{{ currentData.code }}期</p>
        <p class="text-ctp-overlay2">{{ formatDay(currentData.day) }}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th class="border-r border-ctp-surface1" scope="col">区域</th>
            <th scope="col">号码</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(area, index) in intervalArea" :key="area">
            <th :class="['border-r border-ctp-surface1', setIntervalAreaColor(index)]" scope="row">{{ area[0] }}-{{
              area[area.length - 1] }}</th>
            <td class="flex justify-center gap-1">
              <Ball v-for="num in area" :key="num" :num="num" :bgColor="setHotBallBackgroundColor(num)" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-around">
        <div class="flex items-center gap-1 text-sm" v-for="category in intervalCategory" :key="category.title">
          <p>{{ category.title }}(&ge; {{ category.weight }}):</p>
          <p :class="['w-5 h-3 rounded-sm', category.backgroundColor]"></p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <SingleTitle title="重号统计" />

      <p class="text-ctp-text">第{{ repeatStartCode.code }}期 - 第{{ repeatEndCode.code }}期</p>

      <table>
        <thead>
          <tr>
            <th class="border-r border-ctp-surface1" scope="col">号码</th>
            <th class="border-r border-ctp-surface1" scope="col">出现次数</th>
            <th scope="col">出现期次</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in Object.keys(repeatData).sort((a, b) => a - b)" :key="data.code">
            <th align="center" class="border-r border-ctp-surface1" scope="row">
              <Ball :num="data" />
            </th>
            <td class="border-r border-ctp-surface1">{{ repeatData[data].count }}</td>
            <td>
              <p v-for="code in repeatData[data].codes" :key="code">{{ code }}</p>
            </td>
          </tr>
        </tbody>
        <caption class="caption-bottom pt-3 text-sm">只统计出现过2次及以上的号码</caption>
      </table>
    </div>

    <div>
      <SingleTitle title="号码统计" />

      <Dougnut />
    </div>
  </main>
</template>

<style scoped>
table {
  @apply border-collapse border border-ctp-surface1
}

tr {
  @apply border-b border-ctp-surface1
}

td {
  @apply p-2 text-center
}

th {
  @apply p-2 font-normal
}
</style>
