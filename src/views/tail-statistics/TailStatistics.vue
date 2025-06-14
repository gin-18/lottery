<script setup>
import { provide, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTailDataStore } from '@/stores/tail-statistics/tail-data'
import { useTailCountStore } from '@/stores/tail-statistics/tail-number-statistics'
import { useTailTimesCountStore } from '@/stores/tail-statistics/tail-times-statistics'
import { useTailTendencyCountStore } from '@/stores/tail-statistics/tail-tendency-statistics'
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

const tailCountStore = useTailCountStore()
const {
  ranges: tailCountRanges,
  currentCode: tailCountCurrentCode,
  result: tailCountResult,
  currentCodeIndex: tailCountCurrentCodeIndex,
  description: tailCountDescription,
} = storeToRefs(tailCountStore)

const tailTimesCountStore = useTailTimesCountStore()
const {
  codeStep: tailTimesCountCodeStep,
  startCode: tailTimesCountStartCode,
  endCode: tailTimesCountEndCode,
  result: tailTimesCountResult,
  description: tailTimesCountDescription,
} = storeToRefs(tailTimesCountStore)

const tailTendencyCountStore = useTailTendencyCountStore()
const {
  result: tailTendencyCountResult,
  codeStep: tailTendencyCountCodeStep,
  description: tailTendencyCountDescription,
} = storeToRefs(tailTendencyCountStore)

const isLoading = computed(() => (rawDataArray.value.length ? false : true))

provide('rawDataArray', rawDataArray)

watch(
  () => tailCountCurrentCodeIndex.value,
  () => {
    loadTailCount()
  },
)

watch(
  () => tailTimesCountCodeStep.value,
  () => {
    loadTailTimesCount()
  },
)

watch(
  () => tailTendencyCountCodeStep.value,
  () => {
    loadTailTendencyCount()
  },
)

onMounted(async () => {
  await tailDataStore.initData()
  loadTailCount()
  loadTailTimesCount()
  loadTailTendencyCount()
})

function loadTailCount() {
  tailCountStore.initData(rawDataArray.value)
  tailCountStore.countRangeInOneCode()
}

function loadTailTimesCount() {
  tailTimesCountStore.initData(rawDataArray.value)
  tailTimesCountStore.countInDigit(rawDataArray.value)
}

function loadTailTendencyCount() {
  tailTendencyCountStore.initData(rawDataArray.value)
  tailTendencyCountStore.countRangeInGroupCode(rawDataArray.value)
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
          :range="tailCountRanges"
          :current-code="tailCountCurrentCode"
          :result="tailCountResult"
          :description="tailCountDescription"
          thead="尾数"
        />
      </LoadingWrapper>
    </section>

    <section>
      <h2>尾数总数</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeTimesStatistics
          :code-step="tailTimesCountCodeStep"
          :start-code="tailTimesCountStartCode"
          :end-code="tailTimesCountEndCode"
          :result="tailTimesCountResult"
          :description="tailTimesCountDescription"
          chart-id="tail-times-chart"
        />
      </LoadingWrapper>
    </section>

    <section>
      <h2>尾数走势</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeTendencyStatistics
          :result="tailTendencyCountResult"
          :code-step="tailTendencyCountCodeStep"
          :description="tailTendencyCountDescription"
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
