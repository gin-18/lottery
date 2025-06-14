<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useResultDataStore } from '@/stores/result/result-data'
import Header from '@/components/header/Header.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'
import ResultContainer from '@/components/content/ResultContainer.vue'
import Footer from '@/components/Footer.vue'

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
    <div class="flex justify-between items-center md:justify-start md:gap-8">
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
      <ul class="list-none flex flex-col gap-4 p-0">
        <li class="p-0" v-for="data in resultList" :key="data.code">
          <ResultContainer :data="data" />
        </li>
      </ul>
    </LoadingWrapper>
  </main>

  <Footer />
</template>
