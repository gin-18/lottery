<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import { formatDay } from '@/assets/js/formatDay'
import { getBallNum } from '@/assets/js/count'
import Header from '@/components/header/Header.vue'
import Ball from '@/components/content/Ball.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'

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
    <div class="d-flex align-center ga-6 pb-4">
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

    <ul class="d-flex flex-column ga-6">
      <li
        class="pb-6 border-0 border-b-sm"
        v-for="data in dataList"
        :key="data.code"
      >
        <ResultContainer :data="data" />
      </li>
    </ul>
  </v-container>
</template>

<style scoped>
li {
  list-style: none;
}
</style>
