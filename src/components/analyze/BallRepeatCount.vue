<script setup>
import { ref, watch, onMounted } from 'vue'
import { getBallNum, countDuplicates } from '@/assets/js/count'
import Ball from '@/components/content/Ball.vue'

const showSetting = ref(false)

const startData = ref({}) // 重号统计的开始期次
const lastData = ref({}) // 最新期次数据
const codeStep = ref(2) // 重号统计的期数
const repeatNum = ref(2) // 重号统计的重号个数
const repeatData = ref([]) // 重号统计的区间数据
const resultData = ref({}) // 重号统计的数据
const codeStepLeftArrowEnable = ref(true)
const codeStepRightArrowEnable = ref(true)
const repeatNumLeftArrowEnable = ref(true)
const repeatNumRightArrowEnable = ref(true)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

watch([codeStep, repeatNum], () => {
  if (repeatNum.value > codeStep.value) {
    repeatNum.value = codeStep.value
  }
  repeatData.value = props.data.slice(0, codeStep.value)
  startData.value = props.data[codeStep.value - 1]
  checkCodeStepArrowStatus()
  checkRepeatNumArrowStatus()
  countRepeatBall()
})

onMounted(() => {
  startData.value = props.data[codeStep.value - 1]
  lastData.value = props.data[0]
  repeatData.value = props.data.slice(0, codeStep.value)
  countRepeatBall()
  checkCodeStepArrowStatus()
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

  const result = countDuplicates(repeatBallList, repeatNum.value)

  resultData.value = result
}

function addCodeStep() {
  codeStep.value += 1
}

function reduceCodeStep() {
  codeStep.value -= 1
}

function addRepeatNum() {
  repeatNum.value += 1
}

function reduceRepeatNum() {
  repeatNum.value -= 1
}

function checkCodeStepArrowStatus() {
  if (codeStep.value === 1) {
    codeStepLeftArrowEnable.value = false
    codeStepRightArrowEnable.value = true
    return
  }

  if (codeStep.value === props.data.length) {
    codeStepLeftArrowEnable.value = true
    codeStepRightArrowEnable.value = false
    return
  }

  codeStepLeftArrowEnable.value = true
  codeStepRightArrowEnable.value = true
}

function checkRepeatNumArrowStatus() {
  if (repeatNum.value === 1) {
    repeatNumLeftArrowEnable.value = false
    repeatNumRightArrowEnable.value = true
    return
  }

  if (repeatNum.value === codeStep.value) {
    repeatNumLeftArrowEnable.value = true
    repeatNumRightArrowEnable.value = false
    return
  }

  repeatNumLeftArrowEnable.value = true
  repeatNumRightArrowEnable.value = true
}

function toggleSetting() {
  showSetting.value = !showSetting.value
}
</script>

<template>
  <div class="d-flex justify-space-between align-center py-6">
    <p class="py-3">
      第{{ startData.code }}期 - 第{{ lastData.code }}期（共{{ codeStep }}期）
    </p>
    <v-icon icon="fa fa-gear" size="14px" @click="toggleSetting" />
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
        repeatNum
      }}次及以上的号码
    </caption>
  </v-table>

  <v-overlay v-model="showSetting" class="justify-center align-center">
    <div class="d-flex flex-column ga-6 pa-6 rounded text-text bg-background">
      <h2 class="text-h6 font-weight-bold">重号分析设置</h2>

      <div class="d-flex justify-space-between align-center ga-6">
        <p>统计的期次：</p>
        <div class="d-flex align-center ga-8">
          <v-icon
            icon="fa fa-caret-left"
            size="16px"
            :disabled="!codeStepLeftArrowEnable"
            @click="reduceCodeStep"
          />
          <p>{{ codeStep }}</p>
          <v-icon
            icon="fa fa-caret-right"
            size="16px"
            :disabled="!codeStepRightArrowEnable"
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
</template>

<style scoped>
caption {
  caption-side: bottom;
}
</style>
