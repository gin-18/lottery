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
  <main class="px-2 pb-2">
    <div class="d-flex justify-space-between">
      <v-btn v-for="code in codes" :key="code" variant="outlined" :active="activeCodeButton === code"
        @click="changeCode(code)">
        近{{ code }}期
      </v-btn>
    </div>

    <ul>
      <li v-for="data in dataList" :key="data.code">
        <div>
          <div>
            <p>第{{ data.code }}期</p>
            <p>{{ formatDay(data.day) }}</p>
          </div>

          <!-- TODO: 跳转分析页面 -->
          <!-- <button class="text-ctp-blue">详情</button> -->
        </div>
        <div>
          <p>
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
          <p>
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
