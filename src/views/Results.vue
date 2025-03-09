<script setup>
import { ref, computed, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'

const rawDataArray = ref([])
const dataList = ref([])
const nums = [15, 30, 50, 100]
const activeCodeButton = ref(15)

const isLoading = computed(() => (rawDataArray.value.length ? false : true))

onMounted(async () => {
  const res = await getDataByNum(100)
  rawDataArray.value = res.data.list
  setDataList(activeCodeButton.value)
})

function setDataList(num) {
  dataList.value = rawDataArray.value.slice(0, num)
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

    <LoadingWrapper :is-loading="isLoading">
      <ul class="list-none p-0">
        <li class="p-0" v-for="data in dataList" :key="data.code">
          <ResultContainer :data="data" />
        </li>
      </ul>
    </LoadingWrapper>
  </main>
</template>
