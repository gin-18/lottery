<script setup>
import { ref, computed, onMounted } from 'vue'

const codes = [15, 30, 50, 100]
const activeCode = ref(15)
const dataList = ref([])
const buttonBaseClass = 'p-2 border border-ctp-overlay1 rounded-sm text-ctp-overlay1'

onMounted(() => {
  setDataList(activeCode.value)
})

function setDataList(num) {
  fetch(`http://api.huiniao.top/interface/home/lotteryHistory?type=klb&page=1&limit=${num}`)
    .then(res => res.json())
    .then(res => {
      dataList.value = res.data.data.list
    })
}

function changeCode(code) {
  activeCode.value = code
  setDataList(code)
}
</script>

<template>
  <main class="p-2">
    <div class="flex justify-around pt-2 pb-4">
      <button :class="[buttonBaseClass, activeCode === code && 'active-code']" v-for="code in codes" :key="code"
        @click="changeCode(code)">
        近{{ code }}期
      </button>
    </div>

    <ul class="flex flex-col gap-2">
      <li class="flex flex-col gap-6 p-2 rounded-sm bg-ctp-base" v-for="data in dataList" :key="data.code">
        <div class="flex justify-between">
          <div class="flex gap-4">
            <p class="text-ctp-text">第{{ data.code }}期</p>
            <p>{{ data.day }}</p>
          </div>

          <button class="text-ctp-blue">详情</button>
        </div>
        <div>
          <p class="flex justify-between">
            <span>{{ data.one }}</span>
            <span>{{ data.two }}</span>
            <span>{{ data.three }}</span>
            <span>{{ data.four }}</span>
            <span>{{ data.five }}</span>
            <span>{{ data.six }}</span>
            <span>{{ data.seven }}</span>
            <span>{{ data.eight }}</span>
            <span>{{ data.nine }}</span>
            <span>{{ data.ten }}</span>
          </p>
          <p class="flex justify-between">
            <span>{{ data.eleven }}</span>
            <span>{{ data.twelve }}</span>
            <span>{{ data.thirteen }}</span>
            <span>{{ data.fourteen }}</span>
            <span>{{ data.fifteen }}</span>
            <span>{{ data.sixteen }}</span>
            <span>{{ data.seventeen }}</span>
            <span>{{ data.eighteen }}</span>
            <span>{{ data.nineteen }}</span>
            <span>{{ data.twenty }}</span>
          </p>
        </div>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.active-code {
  @apply border-ctp-blue text-ctp-blue
}
</style>
