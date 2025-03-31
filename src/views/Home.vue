<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useHomeData } from '@/stores/home_page_data'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import NextCode from '@/components/content/NextCode.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'
import RewardTable from '@/components/content/RewardTable.vue'
import Footer from '@/components/Footer.vue'

const homeDataStore = useHomeData()
const { cachedData } = storeToRefs(homeDataStore)

const isLoading = computed(() => (cachedData.value ? false : true))

onMounted(homeDataStore.fetchLatestData)
</script>

<template>
  <Header />

  <main>
    <section class="flex items-center gap-2 text-warning">
      <span class="icon-[octicon--unmute-16]"></span>
      <p>本平台仅提供数据服务，不提供任何彩票投注服务!</p>
    </section>

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

  <Footer />
</template>
