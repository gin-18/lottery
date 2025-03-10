<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useHomeData } from '@/stores/home_page_data'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import NextCode from '@/components/content/NextCode.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'
import RewardTable from '@/components/content/RewardTable.vue'

const homeDataStore = useHomeData()
const { cachedData } = storeToRefs(homeDataStore)

const isLoading = computed(() => (cachedData.value ? false : true))

onMounted(homeDataStore.fetchLatestData)
</script>

<template>
  <Header />

  <main>
    <section>
      <LoadingWrapper :is-loading="isLoading">
        <NextCode :latest-data="cachedData" />
      </LoadingWrapper>
    </section>

    <section>
      <h2>最新开奖</h2>
      <LoadingWrapper :is-loading="isLoading">
        <ResultContainer :data="cachedData" />
      </LoadingWrapper>
    </section>

    <section>
      <h2>奖金对照表</h2>
      <RewardTable />
    </section>
  </main>
</template>
