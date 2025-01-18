<script setup>
import { h, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberDistributionStore } from '@/stores/number_distribution'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const numberDistributionStore = useNumberDistributionStore()
const {
  allNumbers,
  codeStep,
  renderData,
  numberCountData,
  startData,
  lastData,
  description,
} = storeToRefs(numberDistributionStore)
watch([() => props.data, () => codeStep.value], () => {
  numberDistributionStore.setData(props.data)
  numberDistributionStore.countNumberOmission(props.data)
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
  <span v-if="!data.length" class="loading loading-dots"></span>
  <div v-else>
    <p>{{ description }}</p>

    <div>
      <div class="flex items-center gap-6">
        <CodeDate :data="startData" />
        <p>-</p>
        <CodeDate :data="lastData" />
      </div>
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
            v-for="(item, index) in renderData"
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
            <td>最大遗漏期数</td>
            <td v-for="item in numberCountData" :key="item.num">
              {{ getMaxOmission(item.omission) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
