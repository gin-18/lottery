<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum, getDataByCode } from '@/assets/request.js'
import SingleTitle from '@/components/analyze/SingleTitle.vue'
import Ball from '@/components/content/Ball.vue'

const intervalNum = ref(10)
const currentData = ref({})
const intervalArea = ref([])
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
  await setCurrentData()
  setIntervalAreaColor()
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

function setHotBallBackgroundColor(num) {
  const isHot = checkBall(num)
  return isHot ? 'bg-ctp-maroon' : 'bg-ctp-overlay0'
}

function setIntervalAreaColor(index) {
  const ballNum = getBallNumInCurrentData()
  const countObj = countSubarrays(intervalArea.value, ballNum)

  if (countObj[index] >= intervalCategory[0].weight) {
    return intervalCategory[0].textColor
  } else if (countObj[index] >= intervalCategory[1].weight) {
    return intervalCategory[1].textColor
  } else {
    return intervalCategory[2].textColor
  }
}

function checkBall(num) {
  let isHot = false

  Object.values(currentData.value).forEach(item => {
    if (item === num) {
      isHot = true
    }
  })

  return isHot
}

function countSubarrays(array2D, targetArray) {
  const countObj = {};

  targetArray.forEach(num => {
    array2D.forEach((subArray, index) => {
      if (subArray.includes(num)) {
        countObj[index] = (countObj[index] || 0) + 1;
      }
    });
  });

  return countObj;
}

function getBallNumInCurrentData() {
  const numberKey = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
  const ballList = []

  Object.keys(currentData.value).forEach(item => {
    if (numberKey.includes(item)) {
      ballList.push(currentData.value[item])
    }
  })

  return ballList
}

// TODO: 选择当前的期次
async function setCurrentData(code = 0) {
  const res = await getDataByCode(code)

  if (!code) {
    currentData.value = res.last
    // console.log(res.last)
    return
  }
}
</script>

<template>
  <main class="p-3">
    <div class="flex flex-col gap-3">
      <div class="flex justify-between">
        <SingleTitle title="区域统计" />
        <span class="icon-[material-symbols--tv-options-input-settings-rounded] text-2xl text-ctp-blue"></span>
      </div>

      <div class="flex gap-6">
        <p class="text-ctp-text">第{{ currentData.code }}期</p>
        <p class="text-ctp-overlay2">{{ currentData.day }}</p>
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
      <div class="flex justify-between">
        <div class="flex items-center gap-1" v-for="category in intervalCategory" :key="category.title">
          <p>{{ category.title }}(&ge; {{ category.weight }}):</p>
          <p :class="['w-6 h-4 rounded-sm', category.backgroundColor]"></p>
        </div>
      </div>
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
