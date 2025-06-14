<script setup>
import { inject, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentNumberStatisticsStore } from '@/stores/number-statistics/current-number-statistics'
import ResultContainer from '@/components/content/ResultContainer.vue'

const rawDataArray = inject('rawDataArray')
const currentNumberStatisticsStore = useCurrentNumberStatisticsStore()
const { currentCode, currentCodeIndex, description } = storeToRefs(
  currentNumberStatisticsStore,
)

watch(currentCodeIndex, () => {
  currentNumberStatisticsStore.initData(rawDataArray.value)
})

onMounted(() => {
  currentNumberStatisticsStore.initData(rawDataArray.value)
})
</script>

<template>
  <p>{{ description }}</p>
  <ResultContainer v-if="currentCode" :data="currentCode" />
</template>
