<script setup>
import { ref, onMounted } from 'vue'
import { getDataByNum } from '@/assets/js/request'

import Header from '@/components/header/Header.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import IntervalCount from '@/components/analyze/interval/IntervalCount.vue'
import IntervalTendencyCount from '@/components/analyze/interval/IntervalTendencyCount.vue'
import Setting from '@/components/analyze/interval/Setting.vue'

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
      <h2>重号统计</h2>
      <RepeatCount :data="data" />
    </section>

    <section>
      <h2>尾部统计</h2>
      <IntervalCount :data="data" type="tail" />
    </section>

    <section>
      <h2>尾部走势</h2>
      <IntervalTendencyCount :data="data" type="tail" />
    </section>

    <Setting type="尾部" />
  </main>
</template>
