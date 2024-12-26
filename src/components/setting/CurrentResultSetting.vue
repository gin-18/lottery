<script setup>
import { storeToRefs } from 'pinia'
import { useCurrentResultStore } from '@/stores/current_result'
import CodeDate from '@/components/content/CodeDate.vue'

const currentResultStore = useCurrentResultStore()
const { currentData } = storeToRefs(currentResultStore)

function addCurrentCode() {
  currentResultStore.addCurrentCode()
}
function reduceCurrentCode() {
  currentResultStore.reduceCurrentCode()
}
</script>

<template>
  <h3>当前期次设置</h3>
  <div>
    <h4>当前开奖期次:</h4>
    <div class="flex justify-between items-center">
      <button class="btn" @click="reduceCurrentCode">
        <span class="icon-[octicon--triangle-left-24]"></span>
      </button>
      <CodeDate :data="currentData" />
      <button class="btn" @click="addCurrentCode">
        <span class="icon-[octicon--triangle-right-24]"></span>
      </button>
    </div>
  </div>
</template>
