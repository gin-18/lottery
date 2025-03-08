<script setup>
import { inject, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentResultStore } from '@/stores/current_result'
import ResultContainer from '@/components/content/ResultContainer.vue'

const rawDataArray = inject('rawDataArray')

const currentResultStore = useCurrentResultStore()
const { currentCode, currentCodeIndex, description } =
  storeToRefs(currentResultStore)

watch([rawDataArray, currentCodeIndex], () => {
  currentResultStore.initData(rawDataArray.value)
})
</script>

<template>
  <div>
    <p>{{ description }}</p>
    <ResultContainer :data="currentCode" />
  </div>
</template>
