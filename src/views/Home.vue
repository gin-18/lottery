<script setup>
import { ref, computed, onMounted } from 'vue'
import { getLatestData } from '@/assets/js/request'
import { formatDay } from '@/assets/js/formatDay'
import { getBallNum } from '@/assets/js/count'
import Header from '@/components/header/Header.vue'
import Ball from '@/components/content/Ball.vue'
import RewardTable from '@/components/content/RewardTable.vue'

const data = ref([])
const ballList = computed(() => getBallNum(data.value))

async function setLatestData() {
  data.value = await getLatestData()
}

onMounted(() => {
  setLatestData()
})
</script>

<template>
  <Header />

  <v-container class="text-text">
    <h2 class="text-h6 font-weight-bold pb-2">最新开奖</h2>
    <div v-if="!data.code"></div>
    <div v-else class="d-flex flex-column ga-2 mb-12 pb-4">
      <div class="d-flex ga-6 text-text pb-2">
        <p>第{{ data.code }}期</p>
        <p>{{ formatDay(data.day) }}</p>
      </div>

      <div class="d-flex align-center ga-4">
        <Ball v-for="num in ballList" :key="num" :num="num" />
      </div>
    </div>

    <h2 class="text-h6 font-weight-bold pb-6">奖金对照表</h2>
    <RewardTable />
  </v-container>
</template>
