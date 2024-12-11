<script setup>
import { storeToRefs } from 'pinia'
import { useNumberAnalyzeStore } from '@/stores/number_analyze'
import { useFrequencyAnalyzeStore } from '@/stores/frequency_analyze'
import { useRepeatAnalyzeStore } from '@/stores/repeat_analyze'
import CodeDate from '@/components/content/CodeDate.vue'
import SettingBox from '@/components/content/SettingBox.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const numberAnalyzeStore = useNumberAnalyzeStore()
const frequencyAnalyzeStore = useFrequencyAnalyzeStore()
const repeatAnalyzeStore = useRepeatAnalyzeStore()

const {
  codeStep: numberCodeStep,
  startData: numberStartData,
  endData: numberEndData,
  startAddArrowStatus,
  startReduceArrowStatus,
  endAddArrowStatus,
  endReduceArrowStatus,
} = storeToRefs(numberAnalyzeStore)
const { codeStep: frequencyCodeStep } = storeToRefs(frequencyAnalyzeStore)

function addNumberStartCode() {
  numberAnalyzeStore.addStartCode(props.data)
}
function reduceNumberStartCode() {
  numberAnalyzeStore.reduceStartCode()
}
function addNumberEndCode() {
  numberAnalyzeStore.addEndCode()
  repeatAnalyzeStore.reduceCurrentCode()
}
function reduceNumberEndCode() {
  numberAnalyzeStore.reduceEndCode()
  repeatAnalyzeStore.addCurrentCode()
}

function addFrequencyStep() {
  frequencyAnalyzeStore.addCodeStep()
}
function reduceFrequencyStep() {
  frequencyAnalyzeStore.reduceCodeStep()
}
</script>

<template>
  <div>
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
                @click="addNumberStartCode"
              >
                <span class="icon-[octicon--triangle-left-24]"></span>
              </button>
              <CodeDate :data="numberStartData" />
              <button
                class="btn"
                :class="{ 'btn-disabled': startReduceArrowStatus }"
                @click="reduceNumberStartCode"
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
                @click="addNumberEndCode"
              >
                <span class="icon-[octicon--triangle-left-24]"></span>
              </button>
              <CodeDate :data="numberEndData" />
              <button
                class="btn"
                :class="{ 'btn-disabled': endReduceArrowStatus }"
                @click="reduceNumberEndCode"
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
  </div>
</template>
