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
  <nav class="d-flex justify-center align-center">
    <v-breadcrumbs :items="items" divider="" active-color="area-cold">
      <template #item="{ item }">
        <v-breadcrumbs-item :to="item.path">
          <v-icon :icon="item.icon" size="22px" />
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </nav>
</template>
