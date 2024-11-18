<script setup>
const items = [
  {
    name: 'HOME',
    path: '/',
    icon: 'fa fa-house',
    size: '15px',
  },
  {
    name: 'LIST',
    path: '/results',
    icon: 'fa fa-list-ul',
    size: '16px',
  },
  {
    name: 'ANALYZE',
    path: '/analyze',
    icon: 'fa fa-chart-line',
    size: '16px',
  },
]
</script>

<template>
  <nav class="d-flex justify-center align-center">
    <v-breadcrumbs
      class="pr-0"
      :items="items"
      divider=""
      active-color="area-cold"
    >
      <template #item="{ item }">
        <v-breadcrumbs-item :to="item.path">
          <v-icon :icon="item.icon" :size="item.size" />
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </nav>
</template>
