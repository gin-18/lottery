<script setup>
import { ref, provide, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTailCountStore } from '@/stores/tail_count'
import { useTailTimesCountStore } from '@/stores/tail_times_count'
import { useTailTendencyCountStore } from '@/stores/tail_tendency_count'
import { getDataByNum } from '@/assets/js/request'

import Header from '@/components/header/Header.vue'
import RepeatCount from '@/components/analyze/RepeatCount.vue'
import RangeCount from '@/components/analyze/range/RangeCount.vue'
import RangeTimesCount from '@/components/analyze/range/RangeTimesCount.vue'
import RangeTendencyCount from '@/components/analyze/range/RangeTendencyCount.vue'
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatCountSetting from '@/components/setting/RepeatCountSetting.vue'
import TailCountSetting from '@/components/setting/TailCountSetting.vue'
import TailTimesCountSetting from '@/components/setting/TailTimesCountSetting.vue'
import TailTendencyCountSetting from '@/components/setting/TailTendencyCountSetting.vue'

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

const rawDataArray = ref([])
provide('rawDataArray', rawDataArray)

onMounted(async () => {
  const res = await getDataByNum(100)
  rawDataArray.value = res.data.list

  loadTailCount()
  loadTailTimesCount()
  loadTailTendencyCount()
})

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
      <RepeatCount />
    </section>

    <section>
      <h2>尾数统计</h2>
      <RangeCount
        :range="tailCountRanges"
        :current-code="tailCountCurrentCode"
        :result="tailCountResult"
        :description="tailCountDescription"
        thead="尾数"
      />
    </section>

    <section>
      <h2>尾数总数</h2>
      <RangeTimesCount
        :code-step="tailTimesCountCodeStep"
        :start-code="tailTimesCountStartCode"
        :end-code="tailTimesCountEndCode"
        :result="tailTimesCountResult"
        :description="tailTimesCountDescription"
        thead="尾数"
      />
    </section>

    <section>
      <h2>尾数走势</h2>
      <RangeTendencyCount
        :result="tailTendencyCountResult"
        :code-step="tailTendencyCountCodeStep"
        :description="tailTendencyCountDescription"
        canvas-id="tail"
        suffix="尾数"
      />
    </section>

    <SettingBox title="尾数统计设置">
      <RepeatCountSetting />
      <TailCountSetting />
      <TailTimesCountSetting />
      <TailTendencyCountSetting />
    </SettingBox>
  </main>
</template>
