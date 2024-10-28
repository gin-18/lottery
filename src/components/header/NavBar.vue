<script setup>
const items = [
  {
    name: 'HOME',
    path: '/',
    icon: 'description',
    size: '20px',
  },
  {
    name: 'LIST',
    path: '/results',
    size: '22px',
    icon: 'subject',
  },
  {
    name: 'ANALYZE',
    path: '/analyze',
    icon: 'equalizer',
    size: '22px',
  },
]
</script>

<template>
  <nav class="d-flex justify-center align-center">
    <v-breadcrumbs :items="items" divider="" active-color="area-cold">
      <template #item="{ item }">
        <v-breadcrumbs-item :to="item.path">
          <v-icon :icon="item.icon" :size="item.size" />
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </nav>
</template>
