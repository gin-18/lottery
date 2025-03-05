<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalTimesCountStore } from '@/stores/interval_times_count'
import { getDataByNum } from '@/assets/js/request'

import Header from '@/components/header/Header.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import IntervalCount from '@/components/analyze/interval/IntervalCount.vue'
import IntervalTendencyCount from '@/components/analyze/interval/IntervalTendencyCount.vue'
import RangeTimesCount from '@/components/analyze/interval/RangeTimesCount.vue'
import Setting from '@/components/analyze/interval/Setting.vue'

// TODO: remove this line after refactor
const data = ref([])

const intervalTimesCountStore = useIntervalTimesCountStore()
const {
  codeStep: intervalTimesCountCodeStep,
  startCode: intervalTimesCountStartCode,
  endCode: intervalTimesCountEndCode,
  result: intervalTimesCountResult,
  description: intervalTimesCountDescription,
} = storeToRefs(intervalTimesCountStore)

onMounted(async () => {
  const res = await getDataByNum(100)
  const rawDataArray = res.data.list

  // TODO: remove this line after refactor
  data.value = res.data.list

  intervalTimesCountStore.initData(rawDataArray)
  intervalTimesCountStore.countInRange(rawDataArray)
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
      <h2>区间统计</h2>
      <IntervalCount :data="data" type="interval" />
    </section>

    <section>
      <h2>区间总数</h2>
      <RangeTimesCount
        :codeStep="intervalTimesCountCodeStep"
        :startCode="intervalTimesCountStartCode"
        :endCode="intervalTimesCountEndCode"
        :result="intervalTimesCountResult"
        :description="intervalTimesCountDescription"
        thead="区间"
      />
    </section>

    <section>
      <h2>区间走势</h2>
      <IntervalTendencyCount :data="data" type="interval" />
    </section>

    <Setting type="区间" />
  </main>
</template>
