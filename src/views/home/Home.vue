<script setup>
import { computed, onMounted, provide, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useHomeData } from '@/stores/home/home-data'
import { useNumberDataStore } from '@/stores/number-statistics/number-data'
import { useCurrentNumberStatisticsStore } from '@/stores/number-statistics/current-number-statistics'
import { useRepeatNumberStatisticsStore } from '@/stores/number-statistics/repeat-number-statistics'
import { useIntervalTendencyStatisticsStore } from '@/stores/interval-statistics/interval-tendency-statistics'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import NextCode from '@/components/content/NextCode.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'
import NumberTimesStatistics from '@/views/number-statistics/components/number-times-statistics/NumberTimesStatistics.vue'
import RangeTendencyStatistics from '@/components/range/RangeTendencyStatistics.vue'

const homeDataStore = useHomeData()
const { cachedData } = storeToRefs(homeDataStore)

const numberDataStore = useNumberDataStore()
const { rawDataArray } = storeToRefs(numberDataStore)

const currentNumberStatisticsStore = useCurrentNumberStatisticsStore()
const repeatNumberStatisticsStore = useRepeatNumberStatisticsStore()
const intervalTendencyStatisticsStore = useIntervalTendencyStatisticsStore()
const {
  codeStep: intervalTendencyCodeStep,
  result: intervalTendencyResult,
  description: intervalTendencyDescription,
} = storeToRefs(intervalTendencyStatisticsStore)

const isLatestDataLoading = computed(() => !cachedData.value)
const isStatisticsLoading = ref(true)

provide('rawDataArray', rawDataArray)

onMounted(loadHomeView)

async function loadHomeView() {
  await Promise.all([homeDataStore.fetchLatestData(), loadHomeStatistics()])
}

async function loadHomeStatistics() {
  if (!rawDataArray.value.length) {
    await numberDataStore.initData()
  }

  currentNumberStatisticsStore.initData(rawDataArray.value)
  repeatNumberStatisticsStore.initData(rawDataArray.value)
  repeatNumberStatisticsStore.countRepeatNumber()
  intervalTendencyStatisticsStore.initData(rawDataArray.value)
  intervalTendencyStatisticsStore.countRangeInGroupCode(rawDataArray.value)
  isStatisticsLoading.value = false
}
</script>

<template>
  <section class="flex items-center gap-2 text-warning">
    <span class="icon-[octicon--unmute-16]"></span>
    <p>本平台仅提供数据服务，不提供任何彩票投注服务!</p>
  </section>

  <section>
    <LoadingWrapper :is-loading="isLatestDataLoading">
      <NextCode :latest-data="cachedData" />
    </LoadingWrapper>
  </section>

  <section>
    <h2>最新开奖</h2>
    <LoadingWrapper :is-loading="isLatestDataLoading">
      <ResultContainer :data="cachedData" />
    </LoadingWrapper>
  </section>

  <section>
    <h2>号码统计</h2>
    <LoadingWrapper :is-loading="isStatisticsLoading">
      <NumberTimesStatistics />
    </LoadingWrapper>
  </section>

  <section>
    <h2>区间走势</h2>
    <LoadingWrapper :is-loading="isStatisticsLoading">
      <RangeTendencyStatistics
        :result="intervalTendencyResult"
        :code-step="intervalTendencyCodeStep"
        :description="intervalTendencyDescription"
        chart-id="home-interval-tendency-chart"
        suffix="区间"
      />
    </LoadingWrapper>
  </section>
</template>
