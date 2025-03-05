<script setup>
import { ref, watch, provide, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalTimesCountStore } from '@/stores/interval_times_count'
import { getDataByNum } from '@/assets/js/request'

import Header from '@/components/header/Header.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import IntervalCount from '@/components/analyze/interval/IntervalCount.vue'
import IntervalTendencyCount from '@/components/analyze/interval/IntervalTendencyCount.vue'
import RangeTimesCount from '@/components/analyze/interval/RangeTimesCount.vue'
import IntervalSetting from '@/components/analyze/interval/IntervalSetting.vue'

const intervalTimesCountStore = useIntervalTimesCountStore()
const {
  codeStep: intervalTimesCountCodeStep,
  startCode: intervalTimesCountStartCode,
  endCode: intervalTimesCountEndCode,
  result: intervalTimesCountResult,
  description: intervalTimesCountDescription,
} = storeToRefs(intervalTimesCountStore)

const rawDataArray = ref([])
provide('rawDataArray', rawDataArray)

onMounted(async () => {
  const res = await getDataByNum(100)
  rawDataArray.value = res.data.list

  loadIntervalTimesCount()
})

watch(
  () => intervalTimesCountCodeStep.value,
  () => {
    loadIntervalTimesCount()
  },
)

function loadIntervalTimesCount() {
  intervalTimesCountStore.initData(rawDataArray.value)
  intervalTimesCountStore.countInRange(rawDataArray.value)
}
</script>

<template>
  <Header />

  <main>
    <section>
      <h2>重号统计</h2>
      <RepeatCount :data="rawDataArray" />
    </section>

    <section>
      <h2>区间统计</h2>
      <IntervalCount :data="rawDataArray" type="interval" />
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
      <IntervalTendencyCount :data="rawDataArray" type="interval" />
    </section>

    <IntervalSetting />
  </main>
</template>
