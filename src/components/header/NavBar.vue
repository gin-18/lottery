<script setup>
const items = [
  {
    name: '开奖结果',
    path: '/results',
  },
  {
    name: '号码分析',
    path: '/number',
  },
  {
    name: '区间分析',
    path: '/interval',
  },
  {
    name: '重号分析',
    path: '/repeat',
  },
]
</script>

<template>
  <nav class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li v-for="(item, index) in items" :key="index">
        <RouterLink :to="item.path" active-class="text-primary">{{
          item.name
        }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>
