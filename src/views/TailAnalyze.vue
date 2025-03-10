<script setup>
import { provide, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTailDataStore } from '@/stores/tail_page_data'
import { useTailCountStore } from '@/stores/tail_count'
import { useTailTimesCountStore } from '@/stores/tail_times_count'
import { useTailTendencyCountStore } from '@/stores/tail_tendency_count'

import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import RangeCount from '@/components/analyze/range/RangeCount.vue'
import RangeTimesCount from '@/components/analyze/range/RangeTimesCount.vue'
import RangeTendencyCount from '@/components/analyze/range/RangeTendencyCount.vue'
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatCountSetting from '@/components/setting/RepeatCountSetting.vue'
import TailCountSetting from '@/components/setting/TailCountSetting.vue'
import TailTimesCountSetting from '@/components/setting/TailTimesCountSetting.vue'
import TailTendencyCountSetting from '@/components/setting/TailTendencyCountSetting.vue'

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
        <RepeatCount />
      </LoadingWrapper>
    </section>

    <section>
      <h2>尾数统计</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeCount
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
        <RangeTimesCount
          :code-step="tailTimesCountCodeStep"
          :start-code="tailTimesCountStartCode"
          :end-code="tailTimesCountEndCode"
          :result="tailTimesCountResult"
          :description="tailTimesCountDescription"
          thead="尾数"
        />
      </LoadingWrapper>
    </section>

    <section>
      <h2>尾数走势</h2>
      <LoadingWrapper :is-loading="isLoading">
        <RangeTendencyCount
          :result="tailTendencyCountResult"
          :code-step="tailTendencyCountCodeStep"
          :description="tailTendencyCountDescription"
          canvas-id="tail"
          suffix="尾数"
        />
      </LoadingWrapper>
    </section>

    <SettingBox title="尾数统计设置">
      <RepeatCountSetting />
      <TailCountSetting />
      <TailTimesCountSetting />
      <TailTendencyCountSetting />
    </SettingBox>
  </main>
</template>
