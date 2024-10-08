<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request.js'
import { formatDay } from '@/assets/js/formatDay.js'
import { countSubarrays, countDuplicates } from '@/assets/js/count.js'
import Chart from 'chart.js/auto'
import SingleTitle from '@/components/content/SingleTitle.vue'
import Ball from '@/components/content/Ball.vue'

// TODO: 设置在store中
const currentData = ref({}) // 当前期次

const intervalNum = ref(10) // 区间统计的分区范围
const intervalArea = ref([]) // 区间统计的区间

const repeatCodeNum = ref(2) // 重号统计的期数
const repeatNum = ref(2) // 重号统计的重号个数
const repeatData = ref([]) // 重号统计的区间数据
const repeatResultData = ref({}) // 重号统计的数据
const repeatStartCode = ref({}) // 重号统计的开始期次
const repeatEndCode = ref({}) // 重号统计的结束期次

const ballCountNum = ref(7)
const ballCountData = ref([])
const ballCountStartCode = ref({})
const ballCountEndCode = ref({})
const ballResultData = ref([])

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
  const dataNum = ballCountNum.value > repeatCodeNum.value ? ballCountNum.value : repeatCodeNum.value
  await setData(dataNum)
  setIntervalAreaColor()
  setIntervalArea(intervalNum.value)
  countRepeatBall()
  countBall()
  showBallCount()
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
  const GRIDCOLOR = '#6c7086'
  const DATACOLOR = '#89b4fa'

  new Chart(
    document.getElementById('my-canvas'),
    {
      type: 'line',
      data: {
        labels: ballResultData.value.map(row => row.num),
        datasets: [
          {
            label: '号码',
            borderWidth: 2,
            borderColor: DATACOLOR,
            pointBackgroundColor: DATACOLOR,
            data: ballResultData.value.map(row => row.count),
          }
        ]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            ticks: {
              color: GRIDCOLOR,
            },
            grid: {
              color: GRIDCOLOR
            }
          },
          y: {
            ticks: {
              color: GRIDCOLOR,
            },
            grid: {
              color: GRIDCOLOR
            },
          }
        }
      }
    }
  )
}

async function setData(num) {
  const res = await getDataByNum(num)

  currentData.value = res.last

  repeatData.value = res.data.list.slice(0, repeatCodeNum.value)
  repeatStartCode.value = res.data.list[repeatNum.value - 1]
  repeatEndCode.value = res.data.list[0]

  ballCountData.value = res.data.list.slice(0, ballCountNum.value)
  ballCountStartCode.value = res.data.list[ballCountNum.value - 1]
  ballCountEndCode.value = res.data.list[0]
}
</script>

<template>
  <main class="flex flex-col gap-8 p-3">
    <div class="flex flex-col gap-3">
      <div class="flex justify-between items-center">
        <SingleTitle title="区域统计" />
        <button class="flex justify-center items-center">
          <span class="icon-[material-symbols--settings-rounded] text-xl"></span>
        </button>
      </div>

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

      <p class="text-ctp-text">第{{ repeatStartCode.code }}期 - 第{{ repeatEndCode.code }}期（共{{ repeatCodeNum }}期）</p>

      <table>
        <thead>
          <tr>
            <th class="border-r border-ctp-surface1" scope="col">号码</th>
            <th class="border-r border-ctp-surface1" scope="col">出现次数</th>
            <th scope="col">出现期次</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in Object.keys(repeatResultData).sort((a, b) => a - b)" :key="data.code">
            <th align="center" class="border-r border-ctp-surface1" scope="row">
              <Ball :num="data" />
            </th>
            <td class="border-r border-ctp-surface1">{{ repeatResultData[data].count }}</td>
            <td>
              <p v-for="code in repeatResultData[data].codes" :key="code">{{ code }}</p>
            </td>
          </tr>
        </tbody>
        <caption class="caption-bottom pt-3 text-sm">只统计出现过{{ repeatNum }}次及以上的号码</caption>
      </table>
    </div>

    <div class="flex flex-col gap-3">
      <SingleTitle title="号码统计" />

      <p class="text-ctp-text">第{{ ballCountStartCode.code }}期 - 第{{ ballCountEndCode.code }}期（共{{ ballCountNum }}期）</p>

      <canvas id="my-canvas" height="420vh" width="100vw"></canvas>
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
