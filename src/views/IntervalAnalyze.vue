<script setup>
import { ref, watch, provide, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalCountStore } from '@/stores/interval_count'
import { useIntervalTimesCountStore } from '@/stores/interval_times_count'
import { useIntervalTendencyCountStore } from '@/stores/interval_tendency_count'
import { getDataByNum } from '@/assets/js/request'

import Header from '@/components/header/Header.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import RangeCount from '@/components/analyze/range/RangeCount.vue'
import RangeTendencyCount from '@/components/analyze/range/RangeTendencyCount.vue'
import RangeTimesCount from '@/components/analyze/range/RangeTimesCount.vue'
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatCountSetting from '@/components/setting/RepeatCountSetting.vue'
import IntervalCountSetting from '@/components/setting/IntervalCountSetting.vue'
import IntervalTimesCountSetting from '@/components/setting/IntervalTimesCountSetting.vue'
import IntervalTendencyCountSetting from '@/components/setting/IntervalTendencyCountSetting.vue'

const intervalCountStore = useIntervalCountStore()
const {
  ranges: intervalCountRanges,
  currentCode: intervalCountCurrentCode,
  currentCodeIndex: intervalCountCurrentCodeIndex,
  result: intervalCountResult,
  description: intervalCountDescription,
} = storeToRefs(intervalCountStore)

const intervalTimesCountStore = useIntervalTimesCountStore()
const {
  codeStep: intervalTimesCountCodeStep,
  startCode: intervalTimesCountStartCode,
  endCode: intervalTimesCountEndCode,
  result: intervalTimesCountResult,
  description: intervalTimesCountDescription,
} = storeToRefs(intervalTimesCountStore)

const intervalTendencyCountStore = useIntervalTendencyCountStore()
const {
  codeStep: intervalTendencyCountCodeStep,
  result: intervalTendencyCountResult,
  description: intervalTendencyCountDescription,
} = storeToRefs(intervalTendencyCountStore)

const rawDataArray = ref([])
provide('rawDataArray', rawDataArray)

onMounted(async () => {
  const res = await getDataByNum(100)
  rawDataArray.value = res.data.list

  loadIntervalCount()
  loadIntervalTimesCount()
  loadIntervalTendencyCount()
})

watch(
  () => intervalCountCurrentCodeIndex.value,
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

watch(
  () => intervalTendencyCountCodeStep.value,
  () => {
    loadIntervalTendencyCount()
  },
)

function loadIntervalCount() {
  intervalCountStore.initData(rawDataArray.value)
  intervalCountStore.countRangeInOneCode()
}

function loadIntervalTimesCount() {
  intervalTimesCountStore.initData(rawDataArray.value)
  intervalTimesCountStore.countInRange(rawDataArray.value)
}

function loadIntervalTendencyCount() {
  intervalTendencyCountStore.initData(rawDataArray.value)
  intervalTendencyCountStore.countRangeInGroupCode(rawDataArray.value)
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
      <h2>区间统计</h2>
      <RangeCount
        :range="intervalCountRanges"
        :current-code="intervalCountCurrentCode"
        :result="intervalCountResult"
        :description="intervalCountDescription"
        thead="区间"
      />
    </section>

    <section>
      <h2>区间总数</h2>
      <RangeTimesCount
        :code-step="intervalTimesCountCodeStep"
        :start-code="intervalTimesCountStartCode"
        :end-code="intervalTimesCountEndCode"
        :result="intervalTimesCountResult"
        :description="intervalTimesCountDescription"
        thead="区间"
      />
    </section>

    <section>
      <h2>区间走势</h2>
      <RangeTendencyCount
        :result="intervalTendencyCountResult"
        :code-step="intervalTendencyCountCodeStep"
        :description="intervalTendencyCountDescription"
        canvas-id="interval"
        suffix="区间"
      />
    </section>

    <SettingBox title="区间统计设置">
      <RepeatCountSetting />
      <IntervalCountSetting />
      <IntervalTimesCountSetting />
      <IntervalTendencyCountSetting />
    </SettingBox>
  </main>
</template>
