<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useHomeData } from '@/stores/home_data'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import NextCode from '@/components/content/NextCode.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'
import RewardTable from '@/components/content/RewardTable.vue'

const homeDataStore = useHomeData()
const { cachedData } = storeToRefs(homeDataStore)

onMounted(async () => {
  await homeDataStore.fetchLatestData()
})
</script>

<template>
  <Header />

  <main>
    <section>
      <NextCode />
    </section>

    <section>
      <h2>最新开奖</h2>
      <!-- <ResultContainer :data="cachedData" /> -->
    </section>

    <section>
      <h2>奖金对照表</h2>
      <RewardTable />
    </section>
  </main>
</template>
