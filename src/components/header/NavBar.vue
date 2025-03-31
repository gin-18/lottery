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
    name: '尾数分析',
    path: '/tail',
  },
]
</script>

<template>
  <nav>
    <ul class="flex gap-4 text-sm md:text-base">
      <li
        class="md:px-4 md:py-2 md:rounded-btn md:hover:bg-base-200 md:cursor-pointer md:transition-colors"
        v-for="(item, index) in items"
        :key="index"
      >
        <RouterLink :to="item.path" active-class="text-primary">{{
          item.name
        }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>
