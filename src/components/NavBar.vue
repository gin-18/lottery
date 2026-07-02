<script setup>
const items = [
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
  {
    name: '投注记录',
    path: '/betting',
  },
  {
    name: '计算器',
    path: '/tools',
  },
  {
    name: '开奖结果',
    path: '/results',
  },
]
</script>

<template>
  <nav class="w-full max-w-full overflow-x-auto md:w-auto md:overflow-visible">
    <ul class="flex flex-nowrap gap-4 text-sm md:text-base">
      <li
        class="shrink-0 rounded-box md:px-4 md:py-2 md:hover:bg-base-200 md:cursor-pointer md:transition-colors"
        v-for="(item, index) in items"
        :key="index"
      >
        <RouterLink
          class="whitespace-nowrap"
          :to="item.path"
          active-class="text-primary"
        >
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
