<script setup>
import { ref, onMounted } from 'vue'
import { getLatestData } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import NextCode from '@/components/content/NextCode.vue'
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

  <main>
    <section>
      <NextCode :data="data" />
    </section>

    <section>
      <h2>最新开奖</h2>
      <ResultContainer :data="data" />
    </section>

    <section>
      <h2>奖金对照表</h2>
      <RewardTable />
    </section>
  </main>
</template>
