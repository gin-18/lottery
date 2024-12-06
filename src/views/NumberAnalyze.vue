<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import NumberCount from '@/components/analyze/number/NumberCount.vue'
import FrequencyCount from '@/components/analyze/number/FrequencyCount.vue'

const data = ref([])

onMounted(async () => {
  const res = await getDataByNum(100)
  data.value = res.data.list
})
</script>

<template>
  <Header />

  <main class="container mx-auto flex flex-col gap-8">
    <div>
      <h2>号码统计</h2>
      <NumberCount :data="data" />
    </div>

    <div>
      <h2>号码频率</h2>
      <FrequencyCount :data="data" />
    </div>
  </main>
</template>
