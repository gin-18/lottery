<script setup>
import { ref, provide, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTailCountStore } from '@/stores/tail_count'
import { useTailTimesCountStore } from '@/stores/tail_times_count'
import { getDataByNum } from '@/assets/js/request'

import Header from '@/components/header/Header.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import RangeCount from '@/components/analyze/range/RangeCount.vue'
import RangeTimesCount from '@/components/analyze/range/RangeTimesCount.vue'
import RangeTendencyCount from '@/components/analyze/range/RangeTendencyCount.vue'
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatCountSetting from '@/components/setting/RepeatCountSetting.vue'
import IntervalCountSetting from '@/components/setting/IntervalCountSetting.vue'
import TailTimesCountSetting from '@/components/setting/TailTimesCountSetting.vue'

const tailCountStore = useTailCountStore()
const {
  ranges: tailCountRanges,
  currentCode: tailCountCurrentCode,
  result: tailCountResult,
} = storeToRefs(tailCountStore)

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

  loadTailCount()
  loadTailTimesCount()
})

watch(
  () => tailTimesCountCodeStep.value,
  () => {
    loadTailTimesCount()
  },
)

function loadTailCount() {
  tailCountStore.initData(rawDataArray.value)
  tailCountStore.countRangeInOneCode()
}

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
      <RepeatCount />
    </section>

    <section>
      <h2>尾数统计</h2>
      <RangeCount
        :range="tailCountRanges"
        :current-code="tailCountCurrentCode"
        :result="tailCountResult"
        thead="尾数"
      />
    </section>

    <section>
      <h2>尾数总数</h2>
      <RangeTimesCount
        :code-step="tailTimesCountCodeStep"
        :start-code="tailTimesCountStartCode"
        :end-code="tailTimesCountEndCode"
        :result="tailTimesCountResult"
        :description="tailTimesCountDescription"
        thead="尾数"
      />
    </section>

    <section>
      <h2>尾数走势</h2>
      <!-- <RangeTendencyCount /> -->
    </section>

    <SettingBox title="尾数统计设置">
      <RepeatCountSetting />
      <IntervalCountSetting />
      <TailTimesCountSetting />
    </SettingBox>
  </main>
</template>
