<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import CurrentResult from '@/components/analyze/number/CurrentResult.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import NumberCount from '@/components/analyze/number/NumberCount.vue'
import FrequencyCount from '@/components/analyze/number/FrequencyCount.vue'
import Setup from '@/components/analyze/number/setting/Setup.vue'

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
      <div class="flex items-center justify-between pb-8">
        <h2 class="p-0">当前开奖</h2>
        <Setup :data="data" />
      </div>
      <CurrentResult :data="data" />
    </div>

    <div>
      <h2>重号统计</h2>
      <RepeatCount :data="data" />
    </div>

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
