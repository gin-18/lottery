<script setup>
import { ref, provide, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTailTimesCountStore } from '@/stores/tail_times_count'
import { getDataByNum } from '@/assets/js/request'

import Header from '@/components/header/Header.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import IntervalCount from '@/components/analyze/interval/IntervalCount.vue'
import IntervalTendencyCount from '@/components/analyze/interval/IntervalTendencyCount.vue'
import RangeTimesCount from '@/components/analyze/interval/RangeTimesCount.vue'
import TailSetting from '@/components/analyze/interval/TailSetting.vue'

const tailTimesCountStore = useTailTimesCountStore()
const {
  codeStep: tailTimesCountCodeStep,
  startCode: tailTimesCountStartCode,
  endCode: tailTimesCountEndCode,
  result: tailTimesCountResult,
  description: tailTimesCountDescription,
} = storeToRefs(tailTimesCountStore)

const rawDataArray = ref([])
provide('rawDataArray', rawDataArray)

onMounted(async () => {
  const res = await getDataByNum(100)
  rawDataArray.value = res.data.list

  loadTailTimesCount()
})

watch(
  () => tailTimesCountCodeStep.value,
  () => {
    loadTailTimesCount()
  },
)

function loadTailTimesCount() {
  tailTimesCountStore.initData(rawDataArray.value)
  tailTimesCountStore.countInDigit(rawDataArray.value)
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
      <h2>尾数统计</h2>
      <IntervalCount :data="rawDataArray" type="tail" />
    </section>

    <section>
      <h2>尾数总数</h2>
      <RangeTimesCount
        :codeStep="tailTimesCountCodeStep"
        :startCode="tailTimesCountStartCode"
        :endCode="tailTimesCountEndCode"
        :result="tailTimesCountResult"
        :description="tailTimesCountDescription"
        thead="尾数"
      />
    </section>

    <section>
      <h2>尾数走势</h2>
      <IntervalTendencyCount :data="rawDataArray" type="tail" />
    </section>

    <TailSetting />
  </main>
</template>
