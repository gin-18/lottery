<script setup>
import { inject, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentResultStore } from '@/stores/current_result'
import ResultContainer from '@/components/content/ResultContainer.vue'

const rawDataArray = inject('rawDataArray')

const currentResultStore = useCurrentResultStore()
const { currentCode, currentCodeIndex, description } =
  storeToRefs(currentResultStore)

watch(currentCodeIndex, () => {
  currentResultStore.initData(rawDataArray.value)
})

onMounted(() => {
  currentResultStore.initData(rawDataArray.value)
})
</script>

<template>
  <p>{{ description }}</p>
  <ResultContainer v-if="currentCode" :data="currentCode" />
</template>
