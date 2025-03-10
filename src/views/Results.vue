<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useResultDataStore } from '@/stores/result_page_data'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'

const resultDataStore = useResultDataStore()
const { resultList, codeSteps, currentCodeStep } = storeToRefs(resultDataStore)

const isLoading = computed(() => (resultList.value.length ? false : true))

onMounted(resultDataStore.initData)

function changeCodeStep(codeStep) {
  resultDataStore.changeCodeStep(codeStep)
}
</script>

<template>
  <Header />

  <main>
    <div class="flex items-center gap-6">
      <button
        class="btn"
        v-for="codeStep in codeSteps"
        :key="codeStep"
        :active="currentCodeStep === codeStep"
        :class="{ 'btn-active btn-primary': currentCodeStep === codeStep }"
        @click="changeCodeStep(codeStep)"
      >
        近{{ codeStep }}期
      </button>
    </div>

    <LoadingWrapper :is-loading="isLoading">
      <ul class="list-none p-0">
        <li class="p-0" v-for="data in resultList" :key="data.code">
          <ResultContainer :data="data" />
        </li>
      </ul>
    </LoadingWrapper>
  </main>
</template>
