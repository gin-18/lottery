<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useNumberDistributionStore } from '@/stores/number_distribution'
import { formatData } from '@/assets/js/utils'
import Ball from '@/components/content/Ball.vue'
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const numberDistributionStore = useNumberDistributionStore()
const { allNumbers, codeStep, renderData, startData, lastData, description } =
  storeToRefs(numberDistributionStore)
watch(
  () => props.data,
  () => {
    numberDistributionStore.setData(props.data)
  },
)

function checkNumberIsHot(num, data) {
  const numbers = formatData(data).balls
  return numbers.includes(num)
}
</script>

<template>
  <div>
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
            <th scope="col">期次</th>
            <th scope="col" v-for="num in allNumbers" :key="num">
              {{ num }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in renderData" :key="item.code">
            <td>{{ item.code }}</td>
            <td v-for="num in allNumbers" :key="num">
              <Ball v-if="checkNumberIsHot(num, item)" :num="num" />
              <span v-else></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
