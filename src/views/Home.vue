<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request.js';
import { formatDay } from '@/assets/js/formatDay.js'
import Ball from '@/components/content/Ball.vue'

let datas = []
const nums = [15, 30, 50, 100]
const activeCodeButton = ref(15)
const dataList = ref([])

onMounted(async () => {
  datas = await getDataByNum(100)
  setDataList(activeCodeButton.value)
})

function setDataList(num) {
  dataList.value = datas.data.list.slice(0, num)
}

function changeCode(num) {
  activeCodeButton.value = num
  setDataList(num)
}
</script>

<template>
  <main class="px-2 pb-2 text-text bg-background">
    <div class="d-flex justify-space-between py-2">
      <v-btn base-color="inactive" active-color="text-text" v-for="code in nums" :key="code" variant="outlined"
        :active="activeCodeButton === code" @click="changeCode(code)">
        近{{ code }}期
      </v-btn>
    </div>

    <ul class="d-flex flex-column ga-2">
      <li class="pa-2 rounded text-text bg-sub-background" v-for="data in dataList" :key="data.code">
        <div class="mb-3">
          <div class="d-flex ga-6">
            <p>第{{ data.code }}期</p>
            <p class="text-subtext">{{ formatDay(data.day) }}</p>
          </div>

          <!-- TODO: 跳转分析页面 -->
          <!-- <button>详情</button> -->
        </div>
        <div class="d-flex flex-column ga-4">
          <p class="d-flex justify-space-between">
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
          <p class="d-flex justify-space-between">
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
