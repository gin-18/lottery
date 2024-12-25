<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import CurrentResult from '@/components/analyze/number/CurrentResult.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import TimesNumberCount from '@/components/analyze/number/TimesNumberCount.vue'
import FrequencyCount from '@/components/analyze/number/FrequencyCount.vue'
import CodeNumberCount from '@/components/analyze/number/CodeNumberCount.vue'
import Setting from '@/components/analyze/number/Setting.vue'

const data = ref([])

onMounted(async () => {
  const res = await getDataByNum(100)
  data.value = res.data.list
})
</script>

<template>
  <Header />

  <main>
    <div>
      <h2>当前期次开奖</h2>
      <CurrentResult :data="data" />
    </div>

    <div>
      <h2>重号统计</h2>
      <RepeatCount :data="data" />
    </div>

    <div>
      <h2>号码统计</h2>
      <TimesNumberCount :data="data" />
    </div>

    <div>
      <h2>号码频率</h2>
      <FrequencyCount :data="data" />
    </div>

    <div>
      <h2>号码次数</h2>
      <CodeNumberCount :data="data" />
    </div>

    <Setting :data="data" />
  </main>
</template>
