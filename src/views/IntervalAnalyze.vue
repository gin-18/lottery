<script setup>
import { provide, watch, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalDataStore } from '@/stores/interval_page_data'
import { useIntervalCountStore } from '@/stores/interval_count'
import { useIntervalTimesCountStore } from '@/stores/interval_times_count'
import { useIntervalTendencyCountStore } from '@/stores/interval_tendency_count'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import RangeCount from '@/components/analyze/range/RangeCount.vue'
import RangeTendencyCount from '@/components/analyze/range/RangeTendencyCount.vue'
import RangeTimesCount from '@/components/analyze/range/RangeTimesCount.vue'
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatCountSetting from '@/components/setting/RepeatCountSetting.vue'
import IntervalCountSetting from '@/components/setting/IntervalCountSetting.vue'
import IntervalTimesCountSetting from '@/components/setting/IntervalTimesCountSetting.vue'
import IntervalTendencyCountSetting from '@/components/setting/IntervalTendencyCountSetting.vue'

const intervalDataStore = useIntervalDataStore()
const { rawDataArray } = storeToRefs(intervalDataStore)

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

const isLoading = computed(() => (rawDataArray.value.length ? false : true))

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

onMounted(async () => {
  await intervalDataStore.initData()
  loadIntervalCount()
  loadIntervalTimesCount()
  loadIntervalTendencyCount()
})

provide('rawDataArray', rawDataArray)

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
      <LoadingWrapper :is-loading="isLoading">
        <RepeatCount />
      </LoadingWrapper>
    </section>

    <section>
      <h2>区间统计</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeCount
          :range="intervalCountRanges"
          :current-code="intervalCountCurrentCode"
          :result="intervalCountResult"
          :description="intervalCountDescription"
          thead="区间"
        />
      </LoadingWrapper>
    </section>

    <section>
      <h2>区间总数</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeTimesCount
          :code-step="intervalTimesCountCodeStep"
          :start-code="intervalTimesCountStartCode"
          :end-code="intervalTimesCountEndCode"
          :result="intervalTimesCountResult"
          :description="intervalTimesCountDescription"
          chart-id="interval-times-chart"
        />
      </LoadingWrapper>
    </section>

    <section>
      <h2>区间走势</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeTendencyCount
          :result="intervalTendencyCountResult"
          :code-step="intervalTendencyCountCodeStep"
          :description="intervalTendencyCountDescription"
          chart-id="interval-tendency-chart"
          suffix="区间"
        />
      </LoadingWrapper>
    </section>

    <SettingBox title="区间统计设置">
      <RepeatCountSetting />
      <IntervalCountSetting />
      <IntervalTimesCountSetting />
      <IntervalTendencyCountSetting />
    </SettingBox>
  </main>
</template>
