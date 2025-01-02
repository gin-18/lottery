<script setup>
import { storeToRefs } from 'pinia'
import { useRepeatCountStore } from '@/stores/repeat_count'
import CodeDate from '@/components/content/CodeDate.vue'

const repeatCountStore = useRepeatCountStore()
const { currentData } = storeToRefs(repeatCountStore)

function addRepeatCurrentCode() {
  repeatCountStore.addCurrentCode()
}
function reduceRepeatCurrentCode() {
  repeatCountStore.reduceCurrentCode()
}
</script>

<template>
  <h3>重号设置</h3>
  <div>
    <h4>重号当前期次:</h4>
    <div class="flex justify-between items-center">
      <button class="btn" @click="reduceRepeatCurrentCode">
        <span class="icon-[octicon--triangle-left-24]"></span>
      </button>
      <CodeDate :data="currentData" />
      <button class="btn" @click="addRepeatCurrentCode">
        <span class="icon-[octicon--triangle-right-24]"></span>
      </button>
    </div>
  </div>
</template>
