<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useTailCountStore } from '@/stores/tail_count'
import CodeDate from '@/components/content/CodeDate.vue'

const tailCountStore = useTailCountStore()
const { currentCode, previousButtonDisable, nextButtonDisable } =
  storeToRefs(tailCountStore)

const rawDataArray = inject('rawDataArray')

function goToPreviousCode() {
  tailCountStore.goToPreviousCode(rawDataArray.value)
}
function goToNextCode() {
  tailCountStore.goToNextCode()
}
</script>

<template>
  <h3>尾数统计</h3>
  <div>
    <h4>当前期次:</h4>
    <div class="flex justify-between items-center">
      <button
        class="btn"
        :disabled="previousButtonDisable"
        @click="goToPreviousCode"
      >
        <span class="icon-[octicon--triangle-left-24]"></span>
      </button>
      <CodeDate :data="currentCode" />
      <button class="btn" :disabled="nextButtonDisable" @click="goToNextCode">
        <span class="icon-[octicon--triangle-right-24]"></span>
      </button>
    </div>
  </div>
</template>
