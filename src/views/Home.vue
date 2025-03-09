<script setup>
import { ref, computed, onMounted } from 'vue'
import { getLatestData } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import NextCode from '@/components/content/NextCode.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'
import RewardTable from '@/components/content/RewardTable.vue'

const data = ref({})

async function setLatestData() {
  data.value = await getLatestData()
}

const isLoading = computed(() =>
  Object.keys(data.value).length ? false : true,
)

onMounted(() => {
  setLatestData()
})
</script>

<template>
  <Header />

  <main>
    <section>
      <LoadingWrapper :is-loading="isLoading">
        <NextCode :data="data" />
      </LoadingWrapper>
    </section>

    <section>
      <h2>最新开奖</h2>
      <LoadingWrapper :is-loading="isLoading">
        <ResultContainer :data="data" />
      </LoadingWrapper>
    </section>

    <section>
      <h2>奖金对照表</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RewardTable />
      </LoadingWrapper>
    </section>
  </main>
</template>
