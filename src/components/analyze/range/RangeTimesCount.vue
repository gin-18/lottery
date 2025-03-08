<script setup>
import CodeDate from '@/components/content/CodeDate.vue'

const props = defineProps({
  codeStep: {
    type: Number,
    required: true,
  },
  startCode: {
    type: Object,
    required: true,
  },
  endCode: {
    type: Object,
    required: true,
  },
  result: {
    type: Object,
    required: true,
  },
  thead: {
    type: String,
  },
  description: {
    type: String,
  },
})
</script>

<template>
  <p>{{ description }}</p>

  <CodeDate :data="[startCode, endCode]" />

  <p>共 {{ codeStep }} 期</p>

  <table class="table">
    <thead>
      <tr>
        <th>{{ thead }}</th>
        <th>次数</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key) in result" :key="key">
        <td>{{ key }}</td>
        <td>{{ value }}</td>
      </tr>
    </tbody>
  </table>
</template>
