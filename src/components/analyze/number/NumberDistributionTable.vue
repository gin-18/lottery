<script setup>
import { ref, watch } from 'vue'
import { formatData, getAllNumbers } from '@/assets/js/utils'
import Ball from '@/components/content/Ball.vue'

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const allNumbers = getAllNumbers()
const renderData = ref([])

watch(
  () => props.data,
  () => {
    renderData.value = props.data.slice(0, 30).reverse()
  },
)

function checkNumberIsHot(num, data) {
  const numbers = formatData(data).balls
  return numbers.includes(num)
}
</script>

<template>
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
          <span v-else>-</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
