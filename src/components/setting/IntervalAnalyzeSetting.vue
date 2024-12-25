<script setup>
import { storeToRefs } from 'pinia'
import { useIntervalAnalyzeStore } from '@/stores/interval_analyze'
import CodeDate from '../content/CodeDate.vue'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})

const intervalAnalyzeStore = useIntervalAnalyzeStore()
const { currentData, rangeStep } = storeToRefs(intervalAnalyzeStore)

function addIntervalCurrentCode() {
  intervalAnalyzeStore.addCurrentCode()
}
function reduceIntervalCurrentCode() {
  intervalAnalyzeStore.reduceCurrentCode()
}

function addIntervalRangeStep() {
  intervalAnalyzeStore.addRangeStep()
}
function reduceIntervalRangeStep() {
  intervalAnalyzeStore.reduceRangeStep()
}
</script>

<template>
  <h3>{{ type }}设置</h3>

  <div>
    <h4>{{ type }}当前期次:</h4>
    <div class="flex justify-between items-center">
      <button class="btn" @click="reduceIntervalCurrentCode">
        <span class="icon-[octicon--triangle-left-24]"></span>
      </button>
      <CodeDate :data="currentData" />
      <button class="btn" @click="addIntervalCurrentCode">
        <span class="icon-[octicon--triangle-right-24]"></span>
      </button>
    </div>
  </div>

  <div>
    <h4>{{ type }}频率期次:</h4>
    <div class="flex justify-between items-center">
      <button class="btn" @click="reduceIntervalRangeStep">
        <span class="icon-[octicon--dash-16]"></span>
      </button>
      <p>{{ rangeStep }}</p>
      <button class="btn" @click="addIntervalRangeStep">
        <span class="icon-[octicon--plus-16]"></span>
      </button>
    </div>
  </div>
</template>
