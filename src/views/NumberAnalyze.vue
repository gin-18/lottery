<script setup>
import { ref, provide, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import CurrentResult from '@/components/analyze/number/CurrentResult.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import TimesNumberCount from '@/components/analyze/number/TimesNumberCount.vue'
import FrequencyCount from '@/components/analyze/number/FrequencyCount.vue'
import CurrentOmissionCount from '@/components/analyze/number/CurrentOmissionCount.vue'
import NumberDistribution from '@/components/analyze/number/NumberDistribution.vue'
import Setting from '@/components/analyze/number/Setting.vue'

const rawDataArray = ref([])
provide('rawDataArray', rawDataArray)

onMounted(async () => {
  const res = await getDataByNum(150)
  rawDataArray.value = res.data.list
})
</script>

<template>
  <Header />

  <main>
    <section>
      <h2>当前开奖</h2>
      <CurrentResult />
    </section>

    <section>
      <h2>重号统计</h2>
      <RepeatCount />
    </section>

    <section>
      <h2>号码统计</h2>
      <TimesNumberCount />
    </section>

    <section>
      <h2>号码频率</h2>
      <FrequencyCount />
    </section>

    <section>
      <h2>号码遗漏</h2>
      <CurrentOmissionCount />
    </section>

    <section>
      <h2>号码分布</h2>
      <NumberDistribution :data="rawDataArray" />
    </section>

    <Setting :data="rawDataArray" />
  </main>
</template>
