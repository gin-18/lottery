<script setup>
import { ref, watch, provide, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalCountStore } from '@/stores/interval_count'
import { useIntervalTimesCountStore } from '@/stores/interval_times_count'
import { getDataByNum } from '@/assets/js/request'

import Header from '@/components/header/Header.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import RangeCount from '@/components/analyze/range/RangeCount.vue'
import IntervalTendencyCount from '@/components/analyze/range/IntervalTendencyCount.vue'
import RangeTimesCount from '@/components/analyze/range/RangeTimesCount.vue'
import IntervalSetting from '@/components/analyze/range/IntervalSetting.vue'

const intervalCountStore = useIntervalCountStore()
const { intervals, currentData, currentDataIndex, category } =
  storeToRefs(intervalCountStore)

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

  loadIntervalCount()
  loadIntervalTimesCount()
})

watch(
  () => currentDataIndex.value,
  () => {
    loadIntervalCount()
  },
)

watch(
  () => intervalTimesCountCodeStep.value,
  () => {
    loadIntervalTimesCount()
  },
)

function loadIntervalCount() {
  intervalCountStore.initData(rawDataArray.value)
}

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
      <RangeCount
        :currentCode="currentData"
        :range="intervals"
        :category="category"
        thead="区间"
      />
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
      <!-- <IntervalTendencyCount :data="rawDataArray" type="interval" /> -->
    </section>

    <IntervalSetting />
  </main>
</template>
