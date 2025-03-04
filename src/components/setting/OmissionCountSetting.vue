<script setup>
import { storeToRefs } from 'pinia'
import { useOmissionCountStore } from '@/stores/omission_count'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const omissionCountStore = useOmissionCountStore()
const { currentCode, previousArrowDisable, nextArrowDisable } =
  storeToRefs(omissionCountStore)

function goToPreviousCode() {
  omissionCountStore.goToPreviousCode(props.data)
}
function goToNextCode() {
  omissionCountStore.goToNextCode()
}
</script>

<template>
  <h3>遗漏统计设置</h3>
  <div>
    <h4>当前期次:</h4>
    <div class="flex justify-between items-center">
      <button
        class="btn"
        :disabled="previousArrowDisable"
        @click="goToPreviousCode"
      >
        <span class="icon-[octicon--triangle-left-24]"></span>
      </button>
      <CodeDate :data="currentCode" />
      <button class="btn" :disabled="nextArrowDisable" @click="goToNextCode">
        <span class="icon-[octicon--triangle-right-24]"></span>
      </button>
    </div>
  </div>
</template>
