<script setup>
import { ref, computed, watch } from 'vue'
import { formatData, countByGroup } from '@/assets/js/count'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

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

watch(
  () => props.data,
  () => {
    startData.value = props.data[startIndex.value]
    endData.value = props.data[endIndex.value]
    countData.value = props.data.slice(endIndex.value, startIndex.value + 1)
    countBall()
    setGroupResultData()
    checkBallCountArrowStatus()
  },
)

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
    .map((item) => formatData(item).balls)
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
</script>

<template>
  <div v-if="!data.length"></div>
  <div v-else>
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-6">
          <CodeDate :data="startData" />
          <p>-</p>
          <CodeDate :data="endData" />
        </div>
        <p>共 {{ codeStep }} 期</p>
      </div>

      <button
        class="icon-[octicon--gear-24]"
        onclick="my_modal_2.showModal()"
      ></button>
    </div>

    <p class="py-6">{{ description }}</p>

    <table class="table">
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
          <td class="flex flex-wrap gap-2">
            <Ball v-for="num in value.nums" :key="num" :num="num" />
          </td>
          <td>{{ value.total }}</td>
        </tr>
      </tbody>
    </table>

    <dialog id="my_modal_2" class="modal">
      <div class="modal-box">
        <h2>号码统计设置</h2>

        <p class="pb-6">共 {{ codeStep }} 期</p>

        <div class="pb-6">
          <h3>起始期次：</h3>
          <div class="flex justify-between items-center">
            <button
              class="btn"
              :class="{ 'btn-disabled': startAddArrowStatus }"
              @click="addStartCode"
            >
              <span class="icon-[octicon--triangle-left-24]"></span>
            </button>
            <CodeDate :data="startData" />
            <button
              class="btn"
              :class="{ 'btn-disabled': startReduceArrowStatus }"
              @click="reduceStartCode"
            >
              <span class="icon-[octicon--triangle-right-24]"></span>
            </button>
          </div>
        </div>

        <div>
          <h3>结束期次：</h3>
          <div class="flex justify-between items-center">
            <button
              class="btn"
              :class="{ 'btn-disabled': endAddArrowStatus }"
              @click="addEndCode"
            >
              <span class="icon-[octicon--triangle-left-24]"></span>
            </button>
            <CodeDate :data="endData" />
            <button
              class="btn"
              :class="{ 'btn-disabled': endReduceArrowStatus }"
              @click="reduceEndCode"
            >
              <span class="icon-[octicon--triangle-right-24]"></span>
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
