<script setup>
import { provide, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTailDataStore } from '@/stores/tail-statistics/tail-data'
import { useTailNumberStatisticsStore } from '@/stores/tail-statistics/tail-number-statistics'
import { useTailTimesStatisticsStore } from '@/stores/tail-statistics/tail-times-statistics'
import { useTailTendencyStatisticsStore } from '@/stores/tail-statistics/tail-tendency-statistics'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatStatistics from '@/views/number-statistics/components/repeat-number-statistics/RepeatNumberStatistics.vue'
import RepeatStatisticsSetting from '@/views/number-statistics/components/repeat-number-statistics/RepeatNumberStatisticsSetting.vue'
import RangeNumberStatistics from '@/components/range/RangeNumberStatistics.vue'
import TailNumberStatisticsSetting from './components/tail-number-statistics/TailNumberStatisticsSetting.vue'
import RangeTimesStatistics from '@/components/range/RangeTimesStatistics.vue'
import TailTimesStatisticsSetting from './components/tail-times-statistics/TailTimesStatisticsSetting.vue'
import RangeTendencyStatistics from '@/components/range/RangeTendencyStatistics.vue'
import TailTendencyStatisticsSetting from './components/tail-tendency-statistics/TailTendencyStatisticsSetting.vue'
import Footer from '@/components/Footer.vue'

const tailDataStore = useTailDataStore()
const { rawDataArray } = storeToRefs(tailDataStore)

const tailNumberStatisticsStore = useTailNumberStatisticsStore()
const {
  ranges: tailNumberStatisticsRanges,
  currentCode: tailNumberStatisticsCurrentCode,
  result: tailNumberStatisticsResult,
  currentCodeIndex: tailNumberStatisticsCurrentCodeIndex,
  description: tailNumberStatisticsDescription,
} = storeToRefs(tailNumberStatisticsStore)

const tailTimesStatisticsStore = useTailTimesStatisticsStore()
const {
  codeStep: tailTimesStatisticsCodeStep,
  startCode: tailTimesStatisticsStartCode,
  endCode: tailTimesStatisticsEndCode,
  result: tailTimesStatisticsResult,
  description: tailTimesStatisticsDescription,
} = storeToRefs(tailTimesStatisticsStore)

const tailTendencyStatisticsStore = useTailTendencyStatisticsStore()
const {
  result: tailTendencyStatisticsResult,
  codeStep: tailTendencyStatisticsCodeStep,
  description: tailTendencyStatisticsDescription,
} = storeToRefs(tailTendencyStatisticsStore)

const isLoading = computed(() => (rawDataArray.value.length ? false : true))

provide('rawDataArray', rawDataArray)

watch(
  () => tailNumberStatisticsCurrentCodeIndex.value,
  () => {
    loadTailNumberStatistics()
  },
)

watch(
  () => tailTimesStatisticsCodeStep.value,
  () => {
    loadTailTimesStatistics()
  },
)

watch(
  () => tailTendencyStatisticsCodeStep.value,
  () => {
    loadTailTendencyStatistics()
  },
)

onMounted(async () => {
  await tailDataStore.initData()
  loadTailNumberStatistics()
  loadTailTimesStatistics()
  loadTailTendencyStatistics()
})

function loadTailNumberStatistics() {
  tailNumberStatisticsStore.initData(rawDataArray.value)
  tailNumberStatisticsStore.countRangeInOneCode()
}

function loadTailTimesStatistics() {
  tailTimesStatisticsStore.initData(rawDataArray.value)
  tailTimesStatisticsStore.countInDigit(rawDataArray.value)
}

function loadTailTendencyStatistics() {
  tailTendencyStatisticsStore.initData(rawDataArray.value)
  tailTendencyStatisticsStore.countRangeInGroupCode(rawDataArray.value)
}
</script>

<template>
  <Header />

  <main>
    <section>
      <h2>重号统计</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RepeatStatistics />
      </LoadingWrapper>
    </section>

    <section>
      <h2>尾数统计</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeNumberStatistics
          :range="tailNumberStatisticsRanges"
          :current-code="tailNumberStatisticsCurrentCode"
          :result="tailNumberStatisticsResult"
          :description="tailNumberStatisticsDescription"
          thead="尾数"
        />
      </LoadingWrapper>
    </section>

    <section>
      <h2>尾数总数</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeTimesStatistics
          :code-step="tailTimesStatisticsCodeStep"
          :start-code="tailTimesStatisticsStartCode"
          :end-code="tailTimesStatisticsEndCode"
          :result="tailTimesStatisticsResult"
          :description="tailTimesStatisticsDescription"
          chart-id="tail-times-chart"
        />
      </LoadingWrapper>
    </section>

    <section>
      <h2>尾数走势</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeTendencyStatistics
          :result="tailTendencyStatisticsResult"
          :code-step="tailTendencyStatisticsCodeStep"
          :description="tailTendencyStatisticsDescription"
          chart-id="tail-tendency-chart"
          suffix="尾数"
        />
      </LoadingWrapper>
    </section>

    <SettingBox title="尾数统计设置">
      <RepeatStatisticsSetting />
      <TailNumberStatisticsSetting />
      <TailTimesStatisticsSetting />
      <TailTendencyStatisticsSetting />
    </SettingBox>
  </main>

  <Footer />
</template>
