<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum, getDataByCode } from '@/assets/request.js'
import SingleTitle from '@/components/analyze/SingleTitle.vue'
import Ball from '@/components/content/Ball.vue'

// TODO: 设置区域范围
const intervalNum = ref(10)
const currentData = ref({})
const ballInterval = ref([])
const intervalCategory = [
  {
    title: '热',
    color: 'bg-ctp-mauve',
  },
  {
    title: '温',
    color: 'bg-ctp-yellow',
  },
  {
    title: '冷',
    color: 'bg-ctp-blue',
  },
  {
    title: '冻',
    color: 'bg-ctp-lavender',
  },
]

onMounted(() => {
  setCurrentData()
  setBallInterval(intervalNum.value)
})

function setBallInterval(size) {
  const chunkedArray = [];
  const balls = Array.from({ length: 80 }, (_, index) => {
    const paddedIndex = index + 1 < 10 ? `0${index + 1}` : index + 1;
    return paddedIndex;
  });

  for (let i = 0; i < balls.length; i += size) {
    chunkedArray.push(balls.slice(i, i + size));
  }

  ballInterval.value = chunkedArray
}

function setHotBallBackgroundColor(num) {
  const isHot = checkBall(num)
  return isHot ? 'bg-ctp-red' : 'bg-ctp-overlay0'
}

function checkBall(num) {
  let isHot = false

  Object.values(currentData.value).forEach(item => {
    if (item === num.toString()) {
      isHot = true
    }
  })

  return isHot
}

// TODO: 选择当前的期次
async function setCurrentData(code = 0) {
  const res = await getDataByCode(code)

  if (!code) {
    currentData.value = res.last
    console.log(res.last)
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
          <tr v-for="num in ballInterval" :key="num">
            <th class="border-r border-ctp-surface1" scope="row">{{ num[0] }}-{{ num[num.length - 1] }}</th>
            <!-- TODO: 设置区域范围 -->
            <td class="flex justify-center gap-1">
              <Ball v-for="n in num" :key="n" :num="n" :bgColor="setHotBallBackgroundColor(n)" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-around">
        <div class="flex items-center gap-3" v-for="category in intervalCategory" :key="category.title">
          <p>{{ category.title }}:</p>
          <p :class="[category.color, 'w-6 h-4 rounded-sm']"></p>
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
