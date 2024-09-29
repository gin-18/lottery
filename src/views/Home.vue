<script setup>
import { ref, onMounted } from 'vue'
import Ball from '@/components/content/Ball.vue'

const codes = [15, 30, 50, 100]
const activeCode = ref(15)
const dataList = ref([])
const buttonBaseClass = 'px-2 py-1 border border-ctp-overlay1 rounded-sm text-ctp-overlay1'

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
        <div class="flex flex-col gap-2">
          <p class="flex justify-between">
            <Ball :num="data.one" />
            <Ball :num="data.two" />
            <Ball :num="data.three" />
            <Ball :num="data.four" />
            <Ball :num="data.five" />
            <Ball :num="data.six" />
            <Ball :num="data.seven" />
            <Ball :num="data.eight" />
            <Ball :num="data.nine" />
            <Ball :num="data.ten" />
          </p>
          <p class="flex justify-between">
            <Ball :num="data.eleven" />
            <Ball :num="data.twelve" />
            <Ball :num="data.thirteen" />
            <Ball :num="data.fourteen" />
            <Ball :num="data.fifteen" />
            <Ball :num="data.sixteen" />
            <Ball :num="data.seventeen" />
            <Ball :num="data.eighteen" />
            <Ball :num="data.nineteen" />
            <Ball :num="data.twenty" />
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
