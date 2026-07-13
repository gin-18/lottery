<script setup>
import { computed, provide, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberDataStore } from '@/stores/number-statistics/number-data'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import LoDrawer from '@/components/content/LoDrawer.vue'
import CurrentNumberStatistics from './components/current-number-statistics/CurrentNumberStatistics.vue'
import CurrentNumberStatisticsSetting from './components/current-number-statistics/CurrentNumberStatisticsSetting.vue'
import RepeatNumberStatistics from './components/repeat-number-statistics/RepeatNumberStatistics.vue'
import RepeatNumberStatisticsSetting from './components/repeat-number-statistics/RepeatNumberStatisticsSetting.vue'
import NumberTimesStatistics from './components/number-times-statistics/NumberTimesStatistics.vue'
import NumberTimesStatisticsSetting from './components/number-times-statistics/NumberTimesStatisticsSetting.vue'
import NumberFrequencyStatistics from './components/number-frequency-statistics/NumberFrequencyStatistics.vue'
import NumberFrequencyStatisticsSetting from './components/number-frequency-statistics/NumberFrequencyStatisticsSetting.vue'
import CurrentOmissionStatistics from './components/current-omission-statistics/CurrentOmissionStatistics.vue'
import CurrentOmissionStatisticsSetting from './components/current-omission-statistics/CurrentOmissionStatisticsSetting.vue'
import NumberDistribution from './components/number-distribution/NumberDistribution.vue'
import NumberDistributionSetting from './components/number-distribution/NumberDistributionSetting.vue'

const numberDataStore = useNumberDataStore()
const { rawDataArray } = storeToRefs(numberDataStore)

const isLoading = computed(() => (rawDataArray.value.length ? false : true))
const isSettingsDrawerOpen = ref(false)

onMounted(numberDataStore.initData)

provide('rawDataArray', rawDataArray)
</script>

<template>
  <section>
    <h2>当前开奖</h2>
    <LoadingWrapper :is-loading="isLoading">
      <CurrentNumberStatistics />
    </LoadingWrapper>
  </section>

  <section>
    <h2>重号统计</h2>
    <LoadingWrapper :is-loading="isLoading">
      <RepeatNumberStatistics />
    </LoadingWrapper>
  </section>

  <section>
    <h2>号码统计</h2>
    <LoadingWrapper :is-loading="isLoading">
      <NumberTimesStatistics />
    </LoadingWrapper>
  </section>

  <section>
    <h2>号码频率</h2>
    <LoadingWrapper :is-loading="isLoading">
      <NumberFrequencyStatistics />
    </LoadingWrapper>
  </section>

  <section>
    <h2>号码遗漏</h2>
    <LoadingWrapper :is-loading="isLoading">
      <CurrentOmissionStatistics />
    </LoadingWrapper>
  </section>

  <section>
    <h2>号码分布</h2>
    <LoadingWrapper :is-loading="isLoading">
      <NumberDistribution />
    </LoadingWrapper>
  </section>

  <button
    type="button"
    aria-label="打开设置"
    class="btn fixed bottom-4 right-4"
    @click="isSettingsDrawerOpen = true"
  >
    <span class="icon-[octicon--gear-16]" aria-hidden="true"></span>
  </button>

  <LoDrawer
    v-model="isSettingsDrawerOpen"
    title="号码分析设置"
    panel-class="md:w-1/3 lg:w-1/4"
  >
    <CurrentNumberStatisticsSetting />
    <RepeatNumberStatisticsSetting />
    <NumberTimesStatisticsSetting />
    <NumberFrequencyStatisticsSetting />
    <CurrentOmissionStatisticsSetting />
    <NumberDistributionSetting />
  </LoDrawer>
</template>
