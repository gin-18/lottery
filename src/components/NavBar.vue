<script setup>
const navItems = [
  {
    name: 'Home',
    path: '/',
    icon: 'icon-[material-symbols--list-alt-rounded]'
  },
  {
    name: 'Analyze',
    path: '/analyze',
    icon: 'icon-[material-symbols--analytics-rounded]'
  }
]
</script>

<template>
  <nav class="flex gap-4">
    <RouterLink class="flex justify-center items-center text-ctp-overlay1" activeClass="link-active"
      v-for="item in navItems" :key="item.name" :to="item.path">
      <span :class="item.icon"></span>
    </RouterLink>
  </nav>
</template>

<style scoped>
span {
  @apply text-2xl
}

.link-active {
  @apply text-ctp-text
}
</style>
