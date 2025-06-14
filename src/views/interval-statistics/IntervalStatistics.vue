<script setup>
import { provide, watch, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useIntervalDataStore } from '@/stores/interval-statistics/interval-data'
import { useIntervalNumberStatisticsStore } from '@/stores/interval-statistics/interval-number-statistics'
import { useIntervalTimesStatisticsStore } from '@/stores/interval-statistics/interval-times-statistics'
import { useIntervalTendencyStatisticsStore } from '@/stores/interval-statistics/interval-tendency-statistics'
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

const intervalNumberStatisticsStore = useIntervalNumberStatisticsStore()
const {
  ranges: intervalNumberStatisticsRanges,
  currentCode: intervalNumberStatisticsCurrentCode,
  currentCodeIndex: intervalNumberStatisticsCurrentCodeIndex,
  result: intervalNumberStatisticsResult,
  description: intervalNumberStatisticsDescription,
} = storeToRefs(intervalNumberStatisticsStore)

const intervalTimesStatisticsStore = useIntervalTimesStatisticsStore()
const {
  codeStep: intervalTimesStatisticsCodeStep,
  startCode: intervalTimesStatisticsStartCode,
  endCode: intervalTimesStatisticsEndCode,
  result: intervalTimesStatisticsResult,
  description: intervalTimesStatisticsDescription,
} = storeToRefs(intervalTimesStatisticsStore)

const intervalTendencyStatisticsStore = useIntervalTendencyStatisticsStore()
const {
  codeStep: intervalTendencyStatisticsCodeStep,
  result: intervalTendencyStatisticsResult,
  description: intervalTendencyStatisticsDescription,
} = storeToRefs(intervalTendencyStatisticsStore)

const isLoading = computed(() => (rawDataArray.value.length ? false : true))

watch(
  () => intervalNumberStatisticsCurrentCodeIndex.value,
  () => {
    loadIntervalNumberStatistics()
  },
)

watch(
  () => intervalTimesStatisticsCodeStep.value,
  () => {
    loadIntervalTimesStatistics()
  },
)

watch(
  () => intervalTendencyStatisticsCodeStep.value,
  () => {
    loadIntervalTendencyStatistics()
  },
)

onMounted(async () => {
  await intervalDataStore.initData()
  loadIntervalNumberStatistics()
  loadIntervalTimesStatistics()
  loadIntervalTendencyStatistics()
})

provide('rawDataArray', rawDataArray)

function loadIntervalNumberStatistics() {
  intervalNumberStatisticsStore.initData(rawDataArray.value)
  intervalNumberStatisticsStore.countRangeInOneCode()
}

function loadIntervalTimesStatistics() {
  intervalTimesStatisticsStore.initData(rawDataArray.value)
  intervalTimesStatisticsStore.countInRange(rawDataArray.value)
}

function loadIntervalTendencyStatistics() {
  intervalTendencyStatisticsStore.initData(rawDataArray.value)
  intervalTendencyStatisticsStore.countRangeInGroupCode(rawDataArray.value)
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
          :range="intervalNumberStatisticsRanges"
          :current-code="intervalNumberStatisticsCurrentCode"
          :result="intervalNumberStatisticsResult"
          :description="intervalNumberStatisticsDescription"
          thead="区间"
        />
      </LoadingWrapper>
    </section>

    <section>
      <h2>区间总数</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeTimesStatistics
          :code-step="intervalTimesStatisticsCodeStep"
          :start-code="intervalTimesStatisticsStartCode"
          :end-code="intervalTimesStatisticsEndCode"
          :result="intervalTimesStatisticsResult"
          :description="intervalTimesStatisticsDescription"
          chart-id="interval-times-chart"
        />
      </LoadingWrapper>
    </section>

    <section>
      <h2>区间走势</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeTendencyStatistics
          :result="intervalTendencyStatisticsResult"
          :code-step="intervalTendencyStatisticsCodeStep"
          :description="intervalTendencyStatisticsDescription"
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
