<script setup>
import { storeToRefs } from 'pinia'
import { useCodeNumberCountStore } from '@/stores/code_number_count'

const codeNumberCountStore = useCodeNumberCountStore()
const { codeStep } = storeToRefs(codeNumberCountStore)

function reduceCodeStep() {
  codeNumberCountStore.reduceCodeStep()
}

function addCodeStep() {
  codeNumberCountStore.addCodeStep()
}
</script>

<template>
  <h3>号码次数设置</h3>
  <div>
    <h4>统计期次：</h4>
    <div class="flex justify-between items-center">
      <button class="btn" @click="reduceCodeStep">
        <span class="icon-[octicon--dash-16]"></span>
      </button>
      <p>{{ codeStep }}</p>
      <button class="btn" @click="addCodeStep">
        <span class="icon-[octicon--plus-16]"></span>
      </button>
    </div>
  </div>
</template>
