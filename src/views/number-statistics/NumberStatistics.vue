<script setup>
import { computed, provide, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberDataStore } from '@/stores/number_page_data'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
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
import NumberDistribution from '@/components/analyze/number/NumberDistribution.vue'
import SettingBox from '@/components/content/SettingBox.vue'
import NumberDistributionSetting from '@/components/setting/NumberDistributionSetting.vue'
import Footer from '@/components/Footer.vue'

const numberDataStore = useNumberDataStore()
const { rawDataArray } = storeToRefs(numberDataStore)

const isLoading = computed(() => (rawDataArray.value.length ? false : true))

onMounted(numberDataStore.initData)

provide('rawDataArray', rawDataArray)
</script>

<template>
  <Header />

  <main>
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

    <SettingBox title="号码分析设置">
      <CurrentNumberStatisticsSetting />
      <RepeatNumberStatisticsSetting />
      <NumberTimesStatisticsSetting />
      <NumberFrequencyStatisticsSetting />
      <CurrentOmissionStatisticsSetting />
      <NumberDistributionSetting />
    </SettingBox>
  </main>

  <Footer />
</template>
