<script setup>
import { ref, watch, onMounted } from 'vue'
import { getBallNum, countDuplicates } from '@/assets/js/count'
import Ball from '@/components/content/Ball.vue'

const showSetting = ref(false)

const startData = ref({}) // 开始期次
const lastData = ref({}) // 最新期次数据
const codeStep = ref(2) // 期数
const repeatTimes = ref(2) // 重复个数
const repeatData = ref([]) // 需要统计的数据
const resultData = ref({}) // 统计后的数据
const codeStepReduceArrowStatus = ref(false)
const codeStepAddArrowStatus = ref(false)
const repeatNumReduceArrowStatus = ref(false)
const repeatNumAddArrowStatus = ref(false)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

watch([codeStep, repeatTimes], (newValue) => {
  if (newValue[1] > newValue[0]) {
    repeatTimes.value = newValue[0]
  }
  startData.value = props.data[newValue[0] - 1]
  repeatData.value = props.data.slice(0, newValue[0])
  countRepeatBall()
  checkCodeStepArrowStatus()
  checkRepeatNumArrowStatus()
})

onMounted(() => {
  lastData.value = props.data[0]
  startData.value = props.data[codeStep.value - 1]
  repeatData.value = props.data.slice(0, codeStep.value)
  countRepeatBall()
  checkCodeStepArrowStatus()
  checkRepeatNumArrowStatus()
})

function countRepeatBall() {
  const repeatBallList = []

  for (let i = 0; i < repeatData.value.length; i++) {
    const ballList = getBallNum(repeatData.value[i])

    repeatBallList.push({
      code: repeatData.value[i].code,
      list: ballList,
    })
  }

  const result = countDuplicates(repeatBallList, repeatTimes.value)

  resultData.value = result
}

function addCodeStep() {
  codeStep.value += 1
}

function reduceCodeStep() {
  codeStep.value -= 1
}

function addRepeatNum() {
  repeatTimes.value += 1
}

function reduceRepeatNum() {
  repeatTimes.value -= 1
}

function checkCodeStepArrowStatus() {
  codeStepReduceArrowStatus.value = false
  codeStepAddArrowStatus.value = false

  if (codeStep.value <= 2) {
    codeStepReduceArrowStatus.value = true
  } else if (codeStep.value >= props.data.length) {
    codeStepAddArrowStatus.value = true
  }
}

function checkRepeatNumArrowStatus() {
  repeatNumReduceArrowStatus.value = false
  repeatNumAddArrowStatus.value = false

  if (repeatTimes.value === codeStep.value) {
    repeatNumReduceArrowStatus.value = true
    repeatNumAddArrowStatus.value = true
  } else if (repeatTimes.value <= 2) {
    repeatNumReduceArrowStatus.value = true
  }
}

function toggleSetting() {
  showSetting.value = !showSetting.value
}
</script>

<template>
  <div class="d-flex justify-space-between align-center py-6">
    <p>
      第{{ startData.code }}期 - 第{{ lastData.code }}期（共{{ codeStep }}期）
    </p>
    <v-icon icon="fa fa-gear" size="16px" @click="toggleSetting" />
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
        v-for="data in Object.keys(resultData).sort((a, b) => a - b)"
        :key="data.code"
      >
        <th scope="row">
          <Ball :num="data" />
        </th>
        <td>{{ resultData[data].count }}</td>
        <td>
          <p v-for="code in resultData[data].codes" :key="code">
            {{ code }}
          </p>
        </td>
      </tr>
    </tbody>
    <caption class="pt-3">
      只统计出现过{{
        repeatTimes
      }}次及以上的号码
    </caption>
  </v-table>

  <v-overlay v-model="showSetting" class="justify-center align-center">
    <div class="d-flex flex-column ga-8 pa-8 rounded text-text bg-background">
      <h2 class="text-h6 font-weight-bold">重号分析设置</h2>

      <div class="d-flex justify-space-between align-center ga-8">
        <p>期数：</p>
        <div class="d-flex align-center ga-8">
          <v-icon
            icon="fa fa-caret-left"
            size="16px"
            :disabled="codeStepReduceArrowStatus"
            @click="reduceCodeStep"
          />
          <p>{{ codeStep }}</p>
          <v-icon
            icon="fa fa-caret-right"
            size="16px"
            :disabled="codeStepAddArrowStatus"
            @click="addCodeStep"
          />
        </div>
      </div>

      <div class="d-flex justify-space-between align-center ga-6">
        <p>重复的次数：</p>
        <div class="d-flex align-center ga-8">
          <v-icon
            icon="fa fa-caret-left"
            size="16px"
            :disabled="repeatNumReduceArrowStatus"
            @click="reduceRepeatNum"
          />
          <p>{{ repeatTimes }}</p>
          <v-icon
            icon="fa fa-caret-right"
            size="16px"
            :disabled="repeatNumAddArrowStatus"
            @click="addRepeatNum"
          />
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<style scoped>
caption {
  caption-side: bottom;
}
</style>
