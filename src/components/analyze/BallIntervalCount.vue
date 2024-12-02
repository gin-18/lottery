<script setup>
import { ref, watch, onMounted } from 'vue'
import { getBallNum, countSubarrays } from '@/assets/js/count'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const showSetting = ref(false)
const partitionStep = ref(10) // 区间统计的步长
const interval = ref([]) // 区间
const currentData = ref({}) // 当前期次数据
const currentCodeIndex = ref(0) // 当前期次数据下标
const codeAddArrowStatus = ref(false)
const codeReduceArrowStatus = ref(false)

const description =
  '这一部分以10为步长，划分80个开奖号码，得到8个区间。统计每个区间内，开奖号码出现的情况，并根据每个区间开奖号码的个数划分为热，温，冷。'

const intervalCategory = ref([
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
])

watch(currentCodeIndex, (newValue) => {
  currentData.value = props.data[newValue]
  setInterval(partitionStep.value)
  checkCodeArrowStatus()
})

onMounted(() => {
  setInterval(partitionStep.value)
  currentData.value = props.data[currentCodeIndex.value]
  checkCodeArrowStatus()
})

function goNextCode() {
  currentCodeIndex.value -= 1
}

function goPreviousCode() {
  currentCodeIndex.value += 1
}

function addWeight(index) {
  intervalCategory.value[index].weight += 1
}

function reduceWeight(index) {
  intervalCategory.value[index].weight -= 1
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

function setInterval(size) {
  const chunkedArray = []
  const balls = Array.from({ length: 80 }, (_, index) => {
    const paddedIndex =
      index + 1 < 10 ? `0${index + 1}` : (index + 1).toString()
    return paddedIndex
  })

  for (let i = 0; i < balls.length; i += size) {
    chunkedArray.push(balls.slice(i, i + size))
  }

  interval.value = chunkedArray
}

function setIntervalColor(index) {
  const ballNum = getBallNum(currentData.value)
  const countObj = countSubarrays(interval.value, ballNum)

  if (countObj[index] >= intervalCategory.value[0].weight) {
    return intervalCategory.value[0].textColor
  } else if (countObj[index] >= intervalCategory.value[1].weight) {
    return intervalCategory.value[1].textColor
  } else {
    return intervalCategory.value[2].textColor
  }
}

function checkCodeArrowStatus() {
  codeAddArrowStatus.value = false
  codeReduceArrowStatus.value = false

  if (currentCodeIndex.value <= 0) {
    codeAddArrowStatus.value = true
  } else if (currentCodeIndex.value >= props.data.length - 1) {
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

function toggleSetting() {
  showSetting.value = !showSetting.value
}
</script>

<template>
  <div class="d-flex justify-space-between align-center py-6">
    <CodeDate :data="currentData" />
    <v-icon icon="fa fa-gear" size="16px" @click="toggleSetting" />
  </div>

  <p class="pb-6">{{ description }}</p>

  <v-table class="border-border text-text bg-background">
    <thead>
      <tr>
        <th scope="col">区域</th>
        <th scope="col">号码</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(area, index) in interval" :key="area">
        <td :class="setIntervalColor(index)">
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

  <div class="d-flex ga-8 pt-6">
    <div
      class="d-flex align-center ga-2"
      v-for="(category, index) in intervalCategory"
      :key="index"
    >
      <p>
        {{ category.title }}(&ge;
        {{ category.weight.toString().padStart(2, '0') }}):
      </p>
      <p class="rounded area-color-box" :class="category.backgroundColor"></p>
    </div>
  </div>

  <v-overlay v-model="showSetting" class="justify-center align-center">
    <div class="d-flex flex-column pa-8 rounded text-text bg-background">
      <h2 class="text-h6 font-weight-bold pb-8">区域分析设置</h2>

      <div class="pb-8">
        <h3 class="pb-3 text-body-1">期次：</h3>
        <div class="d-flex justify-space-between align-center ga-12">
          <v-icon
            icon="fa fa-caret-left"
            size="16px"
            :disabled="codeReduceArrowStatus"
            @click="goPreviousCode"
          />
          <CodeDate :data="currentData" />
          <v-icon
            icon="fa fa-caret-right"
            size="16px"
            :disabled="codeAddArrowStatus"
            @click="goNextCode"
          />
        </div>
      </div>

      <div
        class="d-flex justify-space-between align-center"
        v-for="(category, index) in intervalCategory"
        :key="index"
        :class="index === 0 ? 'pb-8' : ''"
      >
        <p v-if="index !== 2">{{ category.title }}区权重：</p>
        <div v-if="index !== 2" class="d-flex align-center ga-8">
          <v-icon
            icon="fa fa-caret-left"
            size="16px"
            :disabled="checkReduceWeightArrowStatus(index)"
            @click="reduceWeight(index)"
          />
          <p>
            {{ intervalCategory[index].weight.toString().padStart(2, '0') }}
          </p>
          <v-icon
            icon="fa fa-caret-right"
            size="16px"
            :disabled="checkAddWeightArrowStatus(index)"
            @click="addWeight(index)"
          />
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<style scoped>
.area-color-box {
  width: 18px;
  height: 18px;
}
</style>
