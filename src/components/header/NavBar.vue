<script setup>
const items = [
  {
    name: 'HOME',
    path: '/',
    icon: 'fa fa-house',
    size: '16px',
  },
  {
    name: 'LIST',
    path: '/results',
    icon: 'fa fa-list-ul',
    size: '18px',
  },
  {
    name: 'ANALYZE',
    path: '/analyze',
    icon: 'fa fa-chart-line',
    size: '18px',
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
        <v-breadcrumbs-item class="pb-1" :to="item.path">
          <v-icon :icon="item.icon" :size="item.size" />
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </nav>
</template>
