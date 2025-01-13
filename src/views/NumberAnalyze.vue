<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import CurrentResult from '@/components/analyze/number/CurrentResult.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import TimesNumberCount from '@/components/analyze/number/TimesNumberCount.vue'
import FrequencyCount from '@/components/analyze/number/FrequencyCount.vue'
import NumberDistributionTable from '@/components/analyze/number/NumberDistributionTable.vue'
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
    <section>
      <h2>当前期次开奖</h2>
      <CurrentResult :data="data" />
    </section>

    <section>
      <h2>重号统计</h2>
      <RepeatCount :data="data" />
    </section>

    <section>
      <h2>号码统计</h2>
      <TimesNumberCount :data="data" />
    </section>

    <section>
      <h2>号码频率</h2>
      <FrequencyCount :data="data" />
    </section>

    <section class="overflow-auto">
      <h2>号码分布</h2>
      <NumberDistributionTable :data="data" />
    </section>

    <Setting :data="data" />
  </main>
</template>
