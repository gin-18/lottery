<script setup>
import { storeToRefs } from 'pinia'
import { useCurrentResultStore } from '@/stores/current_result'
import { useNumberAnalyzeStore } from '@/stores/number_analyze'
import { useFrequencyAnalyzeStore } from '@/stores/frequency_analyze'
import CodeDate from '@/components/content/CodeDate.vue'
import SettingBox from '@/components/content/SettingBox.vue'
import RepeatAnalyzeSetting from '@/components/setting/RepeatAnalyzeSetting.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const currentResultStore = useCurrentResultStore()
const numberAnalyzeStore = useNumberAnalyzeStore()
const frequencyAnalyzeStore = useFrequencyAnalyzeStore()

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
const { resultData: currentCodeData } = storeToRefs(currentResultStore)

function addNumberStartCode() {
  numberAnalyzeStore.addStartCode()
}
function reduceNumberStartCode() {
  numberAnalyzeStore.reduceStartCode(props.data)
}

function addNumberEndCode() {
  numberAnalyzeStore.addEndCode()
}
function reduceNumberEndCode() {
  numberAnalyzeStore.reduceEndCode()
}

function addFrequencyStep() {
  frequencyAnalyzeStore.addCodeStep()
}
function reduceFrequencyStep() {
  frequencyAnalyzeStore.reduceCodeStep()
}

function addCurrentCode() {
  currentResultStore.addCurrentCode()
}
function reduceCurrentCode() {
  currentResultStore.reduceCurrentCode()
}
</script>

<template>
  <SettingBox title="号码分析设置">
    <div>
      <h3>当前开奖</h3>
      <div>
        <h4>当前开奖期次：</h4>
        <div class="flex justify-between items-center">
          <button class="btn" @click="reduceCurrentCode">
            <span class="icon-[octicon--triangle-left-24]"></span>
          </button>
          <CodeDate :data="currentCodeData" />
          <button class="btn" @click="addCurrentCode">
            <span class="icon-[octicon--triangle-right-24]"></span>
          </button>
        </div>
      </div>
    </div>

    <RepeatAnalyzeSetting />

    <div>
      <h3>号码统计</h3>
      <p>共 {{ numberCodeStep }} 期</p>
      <div>
        <div>
          <h4>起始期次：</h4>
          <div class="flex justify-between items-center">
            <button
              class="btn"
              :class="{ 'btn-disabled': startAddArrowStatus }"
              @click="reduceNumberStartCode"
            >
              <span class="icon-[octicon--triangle-left-24]"></span>
            </button>
            <CodeDate :data="numberStartData" />
            <button
              class="btn"
              :class="{ 'btn-disabled': startReduceArrowStatus }"
              @click="addNumberStartCode"
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
              @click="reduceNumberEndCode"
            >
              <span class="icon-[octicon--triangle-left-24]"></span>
            </button>
            <CodeDate :data="numberEndData" />
            <button
              class="btn"
              :class="{ 'btn-disabled': endReduceArrowStatus }"
              @click="addNumberEndCode"
            >
              <span class="icon-[octicon--triangle-right-24]"></span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div>
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
</template>
