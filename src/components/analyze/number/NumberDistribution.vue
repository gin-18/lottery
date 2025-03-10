<script setup>
import { inject, h, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberDistributionStore } from '@/stores/number_distribution'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'
import LoadingWrapper from '@/components/content/LoadingWrapper.vue'

const numberDistributionStore = useNumberDistributionStore()
const {
  allNumbers,
  codeStep,
  startCode,
  lastCode,
  result,
  numberCountData,
  description,
} = storeToRefs(numberDistributionStore)

const rawDataArray = inject('rawDataArray')

const isLoading = computed(() => (rawDataArray.value.length ? false : true))

watch([rawDataArray, codeStep], () => {
  numberDistributionStore.initData(rawDataArray.value)
  numberDistributionStore.countNumberOmission(rawDataArray.value)
})

function handelNumberOmission(omissions) {
  return omissions.slice(0, codeStep.value).reverse()
}

function getMaxOmission(omissions) {
  const numbers = handelNumberOmission(omissions).filter(
    (item) => typeof item === 'number',
  )
  return Math.max(...numbers)
}

function renderDataInTable(data) {
  if (typeof data.num === 'number') return h('span', data.num)
  return h(Ball, { num: data.num })
}
</script>

<template>
  <LoadingWrapper :is-loading="isLoading">
    <p>{{ description }}</p>

    <div>
      <CodeDate :data="[startCode, lastCode]" />
      <p>近 {{ codeStep }} 期</p>
    </div>

    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th scope>期次</th>
            <th scope="col" v-for="num in allNumbers" :key="num">
              {{ num }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="hover:bg-base-200"
            v-for="(item, index) in result"
            :key="item.code"
          >
            <td>{{ item.code }}</td>
            <td v-for="item in numberCountData" :key="item">
              <render-data-in-table
                :num="handelNumberOmission(item.omission)[index]"
              />
            </td>
          </tr>
          <tr>
            <th class="text-xs">数据统计</th>
            <th class="text-xs" v-for="num in allNumbers" :key="num">
              {{ num }}
            </th>
          </tr>
          <tr>
            <td>出现次数</td>
            <td v-for="item in numberCountData" :key="item.num">
              {{ item.count }}
            </td>
          </tr>
          <tr>
            <td>当前遗漏期数</td>
            <td v-for="item in numberCountData" :key="item.num">
              {{ item.currentOmission }}
            </td>
          </tr>
          <tr>
            <td>最大遗漏期数</td>
            <td v-for="item in numberCountData" :key="item.num">
              {{ getMaxOmission(item.omission) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </LoadingWrapper>
</template>
