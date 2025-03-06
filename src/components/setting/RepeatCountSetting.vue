<script setup>
import { inject } from 'vue'
import { storeToRefs } from 'pinia'
import { useRepeatCountStore } from '@/stores/repeat_count'
import CodeDate from '@/components/content/CodeDate.vue'

const repeatCountStore = useRepeatCountStore()
const { currentCode, previousButtonDisable, nextButtonDisable } =
  storeToRefs(repeatCountStore)

const rawDataArray = inject('rawDataArray')

function goToPreviousCode() {
  repeatCountStore.goToPreviousCode(rawDataArray.value)
}

function goToNextCode() {
  repeatCountStore.goToNextCode()
}
</script>

<template>
  <h3>重号统计</h3>
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
