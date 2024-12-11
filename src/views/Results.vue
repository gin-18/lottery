<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
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

  <main>
    <div class="flex items-center gap-6">
      <button
        class="btn"
        v-for="code in nums"
        :key="code"
        :active="activeCodeButton === code"
        :class="{ 'btn-active btn-primary': activeCodeButton === code }"
        @click="changeCode(code)"
      >
        近{{ code }}期
      </button>
    </div>

    <ul>
      <li v-for="data in dataList" :key="data.code">
        <ResultContainer :data="data" />
      </li>
    </ul>
  </main>
</template>
