<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getBallNum, countByGroup } from '@/assets/js/count'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const showSetting = ref(false)
const startData = ref({}) // 开始期次
const endData = ref({}) // 结束期次
const startIndex = ref(6) // 开始期次下标
const endIndex = ref(0) // 结束期次下标
const countData = ref([]) // 统计的数据
const resultData = ref([]) // 统计后的数据
const groupResultData = ref(null)

const startAddArrowStatus = ref(false)
const startReduceArrowStatus = ref(false)
const endAddArrowStatus = ref(false)
const endReduceArrowStatus = ref(false)

const description =
  '这一部分用于统计给定区间的期次内，每个号码出现的次数。例如：给定的期次区间为7期，则统计这7期内，每个号码出现的次数，对应的表格就是7期中，出现0次的号码有哪些，总共有多少个；出现1次的号码有哪些，总共有多少个，以此类推。'

const codeStep = computed(() => startIndex.value - endIndex.value + 1)

onMounted(() => {
  startData.value = props.data[startIndex.value]
  endData.value = props.data[endIndex.value]
  countData.value = props.data.slice(endIndex.value, startIndex.value + 1)
  countBall()
  setGroupResultData()
  checkBallCountArrowStatus()
})

watch([startIndex, endIndex], (newValue) => {
  startData.value = props.data[newValue[0]]
  endData.value = props.data[newValue[1]]
  countData.value = props.data.slice(newValue[1], newValue[0] + 1)
  countBall()
  setGroupResultData()
  checkBallCountArrowStatus()
})

function addStartCode() {
  if (startIndex.value >= props.data.length - 1) return
  startIndex.value += 1
}

function reduceStartCode() {
  if (startIndex.value <= endIndex.value) return
  startIndex.value -= 1
}

function addEndCode() {
  if (startIndex.value <= endIndex.value) return
  endIndex.value += 1
}

function reduceEndCode() {
  if (endIndex.value <= 0) return
  endIndex.value -= 1
}

function countBall() {
  const data = new Array(80).fill(null).map((item, index) => ({
    num: (index + 1).toString().padStart(2, '0'),
    count: 0,
  }))
  const ballList = countData.value
    .map((item) => getBallNum(item))
    .flatMap((item) => item)

  data.forEach((obj) => {
    obj.count = ballList.filter((item) => item === obj.num).length
  })

  resultData.value = data
}

function setGroupResultData() {
  groupResultData.value = countByGroup(resultData.value)
}

function checkBallCountArrowStatus() {
  startAddArrowStatus.value = false
  startReduceArrowStatus.value = false
  endAddArrowStatus.value = false
  endReduceArrowStatus.value = false

  if (startIndex.value >= props.data.length - 1) {
    startAddArrowStatus.value = true
  } else if (startIndex.value <= endIndex.value) {
    startReduceArrowStatus.value = true
    endAddArrowStatus.value = true
  } else if (endIndex.value <= 0) {
    endReduceArrowStatus.value = true
  }
}

function toggleSetting() {
  showSetting.value = !showSetting.value
}
</script>

<template>
  <div v-if="!data.length"></div>
  <div v-else class="d-flex justify-space-between align-center py-6">
    <div class="d-flex align-center ga-8">
      <div class="d-flex align-center ga-4">
        <CodeDate :data="startData" />
        <p>-</p>
        <CodeDate :data="endData" />
      </div>
      <p>共 {{ codeStep }} 期</p>
    </div>

    <v-icon icon="fa fa-gear" size="16px" @click="toggleSetting" />
  </div>

  <p class="pb-6">{{ description }}</p>

  <v-table class="border-border text-text bg-background">
    <thead>
      <tr>
        <th>次数</th>
        <th>号码</th>
        <th>个数</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key) in groupResultData" :key="key">
        <th>{{ key }}</th>
        <td class="ball-container ga-4 h-100">
          <Ball v-for="num in value.nums" :key="num" :num="num" />
        </td>
        <td>{{ value.total }}</td>
      </tr>
    </tbody>
  </v-table>

  <v-overlay v-model="showSetting" class="justify-center align-center">
    <div class="d-flex flex-column ga-8 pa-8 rounded text-text bg-background">
      <h2 class="text-h6 font-weight-bold">号码统计设置</h2>

      <p>共 {{ codeStep }} 期</p>

      <div>
        <h3 class="pb-3 text-body-1">起始期次：</h3>
        <div class="d-flex justify-space-between align-center ga-12">
          <v-icon
            icon="fa fa-caret-left"
            size="16px"
            :disabled="startAddArrowStatus"
            @click="addStartCode"
          />
          <CodeDate :data="startData" />
          <v-icon
            icon="fa fa-caret-right"
            size="16px"
            :disabled="startReduceArrowStatus"
            @click="reduceStartCode"
          />
        </div>
      </div>

      <div>
        <h3 class="pb-3 text-body-1">结束期次：</h3>
        <div class="d-flex justify-space-between align-center ga-12">
          <v-icon
            icon="fa fa-caret-left"
            size="16px"
            :disabled="endAddArrowStatus"
            @click="addEndCode"
          />
          <CodeDate :data="endData" />
          <v-icon
            icon="fa fa-caret-right"
            size="16px"
            :disabled="endReduceArrowStatus"
            @click="reduceEndCode"
          />
        </div>
      </div>
    </div>
  </v-overlay>
</template>

<style scoped>
.ball-container {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  padding: 1rem !important;
}
</style>
