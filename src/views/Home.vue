<script setup>
import { ref, onMounted } from 'vue'
import { getLatestData } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'
import RewardTable from '@/components/content/RewardTable.vue'

const data = ref([])

async function setLatestData() {
  data.value = await getLatestData()
}

onMounted(() => {
  setLatestData()
})
</script>

<template>
  <Header />

  <v-container class="d-flex flex-column ga-16 text-text">
    <div class="section">
      <h2 class="text-h6 font-weight-bold">最新开奖</h2>
      <div v-if="!data.code"></div>
      <ResultContainer v-else :data="data" />
    </div>

    <div class="section">
      <h2 class="text-h6 font-weight-bold pb-4">奖金对照表</h2>
      <RewardTable />
    </div>
  </v-container>
</template>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
