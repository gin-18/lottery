<script setup>
import { ref, watch, onMounted } from 'vue'
import { formatDay } from '@/assets/js/formatDay.js'
import { getBallNum, countSubarrays } from '@/assets/js/count.js'
import Ball from '@/components/content/Ball.vue'

const step = ref(10) // 区间统计的分区范围
const areas = ref([]) // 区间统计的区间
const currentData = ref({}) // 当前期次数据
const currentDataIndex = ref(0) // 当前期次数据下标
const rightArrowEnable = ref(true)
const leftArrowEnable = ref(true)

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

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

onMounted(() => {
  setIntervalArea(step.value)
  currentData.value = props.data[currentDataIndex.value]
  checkAreaArrowStatus()
})

watch(currentDataIndex, (newValue) => {
  currentData.value = props.data[newValue]
  setIntervalArea(step.value)
  checkAreaArrowStatus()
})

function getNextData() {
  currentDataIndex.value -= 1
}

function getPreviousData() {
  currentDataIndex.value += 1
}

function setHotBallBackgroundColor(num) {
  return checkBallIsHot(num) ? 'bg-ball-hot' : 'bg-ball-cold'
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

  areas.value = chunkedArray
}

function setIntervalAreaColor(index) {
  const ballNum = getBallNum(currentData.value)
  const countObj = countSubarrays(areas.value, ballNum)

  if (countObj[index] >= intervalCategory[0].weight) {
    return intervalCategory[0].textColor
  } else if (countObj[index] >= intervalCategory[1].weight) {
    return intervalCategory[1].textColor
  } else {
    return intervalCategory[2].textColor
  }
}

function checkAreaArrowStatus() {
  if (currentDataIndex.value === 0) {
    rightArrowEnable.value = false
    leftArrowEnable.value = true
    return
  }

  if (currentDataIndex.value === props.data.length - 1) {
    leftArrowEnable.value = false
    rightArrowEnable.value = true
    return
  }

  leftArrowEnable.value = true
  rightArrowEnable.value = true
}
</script>

<template>
  <div class="d-flex justify-space-between align-center py-6">
    <v-icon
      icon="fa fa-caret-left"
      size="16px"
      :disabled="!leftArrowEnable"
      @click="getPreviousData"
    />
    <div class="d-flex ga-6">
      <p>第{{ currentData.code }}期</p>
      <p>{{ formatDay(currentData.day) }}</p>
    </div>
    <v-icon
      icon="fa fa-caret-right"
      size="16px"
      :disabled="!rightArrowEnable"
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
      <tr v-for="(area, index) in areas" :key="area">
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
      <p class="rounded area-color-box" :class="category.backgroundColor"></p>
    </div>
  </div>
</template>

<style scoped>
.area-color-box {
  width: 18px;
  height: 18px;
}

th {
  font-weight: bold !important;
}
</style>
