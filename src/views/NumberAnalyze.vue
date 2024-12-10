<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberAnalyzeStore } from '@/stores/number_analyze'
import { useFrequencyAnalyzeStore } from '@/stores/frequency_analyze'
import { getDataByNum } from '@/assets/js/request'
import Header from '@/components/header/Header.vue'
import CodeDate from '@/components/content/CodeDate.vue'
import NumberCount from '@/components/analyze/number/NumberCount.vue'
import FrequencyCount from '@/components/analyze/number/FrequencyCount.vue'
import SettingBox from '@/components/content/SettingBox.vue'

const data = ref([])

const numberAnalyzeStore = useNumberAnalyzeStore()
const frequencyAnalyzeStore = useFrequencyAnalyzeStore()
const {
  codeStep: numberCodeStep,
  startData,
  endData,
  startAddArrowStatus,
  startReduceArrowStatus,
  endAddArrowStatus,
  endReduceArrowStatus,
} = storeToRefs(numberAnalyzeStore)
const { codeStep: frequencyCodeStep } = storeToRefs(frequencyAnalyzeStore)

onMounted(async () => {
  const res = await getDataByNum(100)
  data.value = res.data.list
})

function addStartCode() {
  numberAnalyzeStore.addStartCode(data)
}

function reduceStartCode() {
  numberAnalyzeStore.reduceStartCode()
}

function addEndCode() {
  numberAnalyzeStore.addEndCode()
}

function reduceEndCode() {
  numberAnalyzeStore.reduceEndCode()
}

function addFrequencyStep() {
  frequencyAnalyzeStore.addCodeStep()
}

function reduceFrequencyStep() {
  frequencyAnalyzeStore.reduceCodeStep()
}
</script>

<template>
  <Header />

  <main class="container mx-auto flex flex-col gap-8">
    <SettingBox class="self-end">
      <div>
        <h2>号码分析设置</h2>

        <h3>号码统计</h3>
        <div class="pb-12">
          <p class="pb-6">共 {{ numberCodeStep }} 期</p>

          <div class="pb-6">
            <h4>起始期次：</h4>
            <div class="flex justify-between items-center">
              <button
                class="btn"
                :class="{ 'btn-disabled': startAddArrowStatus }"
                @click="addStartCode"
              >
                <span class="icon-[octicon--triangle-left-24]"></span>
              </button>
              <CodeDate :data="startData" />
              <button
                class="btn"
                :class="{ 'btn-disabled': startReduceArrowStatus }"
                @click="reduceStartCode"
              >
                <span class="icon-[octicon--triangle-right-24]"></span>
              </button>
            </div>
          </div>

          <div>
            <h4>结束期次：</h4>
            <div class="flex justify-between items-center">
              <button
                class="btn"
                :class="{ 'btn-disabled': endAddArrowStatus }"
                @click="addEndCode"
              >
                <span class="icon-[octicon--triangle-left-24]"></span>
              </button>
              <CodeDate :data="endData" />
              <button
                class="btn"
                :class="{ 'btn-disabled': endReduceArrowStatus }"
                @click="reduceEndCode"
              >
                <span class="icon-[octicon--triangle-right-24]"></span>
              </button>
            </div>
          </div>
        </div>

        <h3>号码频率</h3>
        <div>
          <h4>统计步长：</h4>
          <div class="flex justify-between items-center">
            <button class="btn" @click="reduceFrequencyStep">
              <span class="icon-[octicon--triangle-left-24]"></span>
            </button>
            <p>{{ frequencyCodeStep }}</p>
            <button class="btn" @click="addFrequencyStep">
              <span class="icon-[octicon--triangle-right-24]"></span>
            </button>
          </div>
        </div>
      </div>
    </SettingBox>

    <div>
      <h2>号码统计</h2>
      <NumberCount :data="data" />
    </div>

    <div>
      <h2>号码频率</h2>
      <FrequencyCount :data="data" />
    </div>
  </main>
</template>
