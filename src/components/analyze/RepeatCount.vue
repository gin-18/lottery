<script setup>
import { inject, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRepeatCountStore } from '@/stores/repeat_count'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'

const rawDataArray = inject('rawDataArray')

const repeatCountStore = useRepeatCountStore()
const { startCode, currentCode, currentCodeIndex, result, description } =
  storeToRefs(repeatCountStore)

const isLoading = computed(() => (rawDataArray.value.length ? false : true))

watch([rawDataArray, currentCodeIndex], () => {
  repeatCountStore.initData(rawDataArray.value)
  repeatCountStore.countRepeatNumber()
})
</script>

<template>
  <LoadingWrapper :is-loading="isLoading">
    <p>{{ description }}</p>

    <CodeDate :data="[startCode, currentCode]" />

    <div class="flex items-center gap-4">
      <p>共 {{ result.length }} 个:</p>
      <Ball v-for="num in result" :key="num" :num="num" />
    </div>
  </LoadingWrapper>
</template>
