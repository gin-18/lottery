<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import { formatDay } from '@/assets/js/formatDay'
import { getBallNum } from '@/assets/js/count'
import Header from '@/components/header/Header.vue'
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
  <Header />

  <v-container class="text-text">
    <div class="d-flex justify-space-between pb-4">
      <v-btn
        base-color="inactive"
        active-color="text-text"
        v-for="code in nums"
        :key="code"
        variant="outlined"
        :active="activeCodeButton === code"
        @click="changeCode(code)"
      >
        近{{ code }}期
      </v-btn>
    </div>

    <ul class="d-flex flex-column ga-4">
      <li
        class="pb-4 border-0 border-b-sm border-dashed border-border text-text"
        v-for="data in dataList"
        :key="data.code"
      >
        <div class="d-flex ga-6 pb-2">
          <p>第{{ data.code }}期</p>
          <p>{{ formatDay(data.day) }}</p>
        </div>
        <div class="ball-container">
          <Ball v-for="num in getBallNum(data)" :key="num" :num="num" />
        </div>
      </li>
    </ul>
  </v-container>
</template>

<style scoped>
li {
  list-style: none;
}
</style>
