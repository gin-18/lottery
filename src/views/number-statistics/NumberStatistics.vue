<script setup>
import { computed, provide, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberDataStore } from '@/stores/number_page_data'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import CurrentNumberStatistics from './components/CurrentNumberStatistics.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import TimesNumberCount from '@/components/analyze/number/TimesNumberCount.vue'
import FrequencyCount from '@/components/analyze/number/FrequencyCount.vue'
import CurrentOmissionCount from '@/components/analyze/number/CurrentOmissionCount.vue'
import NumberDistribution from '@/components/analyze/number/NumberDistribution.vue'
import SettingBox from '@/components/content/SettingBox.vue'
import CurrentResultSetting from '@/components/setting/CurrentResultSetting.vue'
import RepeatCountSetting from '@/components/setting/RepeatCountSetting.vue'
import TimesNumberCountSetting from '@/components/setting/TimesNumberCountSetting.vue'
import FrequencyCountSetting from '@/components/setting/FrequencyCountSetting.vue'
import OmissionCountSetting from '@/components/setting/OmissionCountSetting.vue'
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
        <RepeatCount />
      </LoadingWrapper>
    </section>

    <section>
      <h2>号码统计</h2>
      <LoadingWrapper :is-loading="isLoading">
        <TimesNumberCount />
      </LoadingWrapper>
    </section>

    <section>
      <h2>号码频率</h2>
      <LoadingWrapper :is-loading="isLoading">
        <FrequencyCount />
      </LoadingWrapper>
    </section>

    <section>
      <h2>号码遗漏</h2>
      <LoadingWrapper :is-loading="isLoading">
        <CurrentOmissionCount />
      </LoadingWrapper>
    </section>

    <section>
      <h2>号码分布</h2>
      <LoadingWrapper :is-loading="isLoading">
        <NumberDistribution />
      </LoadingWrapper>
    </section>

    <SettingBox title="号码分析设置">
      <CurrentResultSetting />
      <RepeatCountSetting />
      <TimesNumberCountSetting />
      <FrequencyCountSetting />
      <OmissionCountSetting />
      <NumberDistributionSetting />
    </SettingBox>
  </main>

  <Footer />
</template>
