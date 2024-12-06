<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'

import Header from '@/components/header/Header.vue'
import IntervalCount from '@/components/analyze/IntervalCount.vue'

const data = ref([])

onMounted(async () => {
  const res = await getDataByNum(100)
  data.value = res.data.list
})
</script>

<template>
  <Header />

  <main class="container mx-auto">
    <IntervalCount :data="data" />
  </main>
</template>
