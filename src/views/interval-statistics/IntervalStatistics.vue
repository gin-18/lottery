<script setup>
import { provide, watch, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalDataStore } from '@/stores/interval_page_data'
import { useIntervalCountStore } from '@/stores/interval_count'
import { useIntervalTimesCountStore } from '@/stores/interval_times_count'
import { useIntervalTendencyCountStore } from '@/stores/interval_tendency_count'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatNumberStatistics from '@/views/number-statistics/components/repeat-number-statistics/RepeatNumberStatistics.vue'
import RepeatNumberStatisticsSetting from '@/views/number-statistics/components/repeat-number-statistics/RepeatNumberStatisticsSetting.vue'
import RangeNumberStatistics from '@/components/range/RangeNumberStatistics.vue'
import IntervalNumberStatisticsSetting from './components/interval-number-statistics/IntervalNumberStatisticsSetting.vue'
import RangeTimesStatistics from '@/components/range/RangeTimesStatistics.vue'
import IntervalTimesStatisticsSetting from './components/interval-times-statistics/IntervalTimesStatisticsSetting.vue'
import RangeTendencyStatistics from '@/components/range/RangeTendencyStatistics.vue'
import IntervalTendencyStatisticsSetting from './components/interval-tendency-statistics/IntervalTendencyStatisticsSetting.vue'
import Footer from '@/components/Footer.vue'

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
        <RepeatNumberStatistics />
      </LoadingWrapper>
    </section>

    <section>
      <h2>区间统计</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeNumberStatistics
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
        <RangeTimesStatistics
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
        <RangeTendencyStatistics
          :result="intervalTendencyCountResult"
          :code-step="intervalTendencyCountCodeStep"
          :description="intervalTendencyCountDescription"
          chart-id="interval-tendency-chart"
          suffix="区间"
        />
      </LoadingWrapper>
    </section>

    <SettingBox title="区间统计设置">
      <RepeatNumberStatisticsSetting />
      <IntervalNumberStatisticsSetting />
      <IntervalTimesStatisticsSetting />
      <IntervalTendencyStatisticsSetting />
    </SettingBox>
  </main>

  <Footer />
</template>
