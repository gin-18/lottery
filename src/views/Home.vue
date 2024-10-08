<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePaletteStore } from '@/stores/palette.js'
import { getDataByNum } from '@/assets/js/request.js'
import { formatDay } from '@/assets/js/formatDay.js'
import Ball from '@/components/content/Ball.vue'

const { activeColor } = storeToRefs(usePaletteStore())

const codes = [15, 30, 50, 100]
const activeCodeButton = ref(15)
const dataList = ref([])

onMounted(() => {
  setDataList(activeCodeButton.value)
})

async function setDataList(num) {
  const res = await getDataByNum(num)
  dataList.value = res.data.list
}

function changeCode(code) {
  activeCodeButton.value = code
  setDataList(code)
}
</script>

<template>
  <main class="p-3">
    <div class="flex justify-between pb-6">
      <v-btn v-for="code in codes" :key="code" variant="outlined" :active="activeCodeButton === code"
        :active-color="activeColor" @click="changeCode(code)">
        近{{ code }}期
      </v-btn>
    </div>

    <ul class="flex flex-col gap-3">
      <li class="flex flex-col gap-6 p-3 rounded-sm bg-ctp-base" v-for="data in dataList" :key="data.code">
        <div class="flex justify-between">
          <div class="flex gap-4">
            <p class="text-ctp-text">第{{ data.code }}期</p>
            <p class="text-ctp-overlay2">{{ formatDay(data.day) }}</p>
          </div>

          <!-- TODO: 跳转分析页面 -->
          <!-- <button class="text-ctp-blue">详情</button> -->
        </div>
        <div class="flex flex-col gap-3">
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
