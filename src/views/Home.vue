<script setup>
import { ref, onMounted } from 'vue'
import { getLatestData } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'
import RewardTable from '@/components/content/RewardTable.vue'

const data = ref([])

async function setLatestData() {
  data.value = await getLatestData()
  console.log(data.value)
}

onMounted(() => {
  setLatestData()
})
</script>

<template>
  <Header />

  <main>
    <div>
      <h2>最新开奖</h2>
      <div v-if="!data.code">
        <span class="loading loading-dots loading-sm"></span>
      </div>
      <ResultContainer v-else :data="data" />
    </div>

    <div>
      <h2>奖金对照表</h2>
      <RewardTable />
    </div>
  </main>
</template>
