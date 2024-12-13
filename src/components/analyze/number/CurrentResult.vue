<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentResultStore } from '@/stores/current_result'
import ResultContainer from '@/components/content/ResultContainer.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const currentResultStore = useCurrentResultStore()
const { resultData, currentDataIndex } = storeToRefs(currentResultStore)

watch([() => props.data, currentDataIndex], () => {
  currentResultStore.setCurrentData(props.data)
})
</script>

<template>
  <div v-if="!data.length">
    <span class="loading loading-dots loading-sm"></span>
  </div>
  <div v-else>
    <ResultContainer :data="resultData" />
  </div>
</template>
