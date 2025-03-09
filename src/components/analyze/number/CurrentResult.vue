<script setup>
import { inject, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCurrentResultStore } from '@/stores/current_result'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'

const rawDataArray = inject('rawDataArray')

const currentResultStore = useCurrentResultStore()
const { currentCode, currentCodeIndex, description } =
  storeToRefs(currentResultStore)

const isLoading = computed(() => (rawDataArray.value.length ? false : true))

watch([rawDataArray, currentCodeIndex], () => {
  currentResultStore.initData(rawDataArray.value)
})
</script>

<template>
  <LoadingWrapper :is-loading="isLoading">
    <p>{{ description }}</p>
    <ResultContainer :data="currentCode" />
  </LoadingWrapper>
</template>
