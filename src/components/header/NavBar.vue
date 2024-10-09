<script setup>
const items = [
  {
    name: 'LIST',
    path: '/',
    icon: 'subject',
  },
  {
    name: 'ANALYZE',
    path: '/analyze',
    icon: 'equalizer',
  }
]
</script>

<template>
  <nav class="d-flex ga-2">
    <RouterLink class="text-black" activeClass="link-active" v-for="item in items" :key="item.name" :to="item.path">
      <v-icon :icon="item.icon" />
    </RouterLink>
  </nav>
</template>

<style scoped>
.link-active {
  color: red !important;
}
</style>
