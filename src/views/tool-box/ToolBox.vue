<script setup>
import Header from '@/components/header/Header.vue'
import CompoundBet from './components/compound-bet/CompoundBet.vue'
</script>

<template>
  <Header />

  <main>
    <h2>奖金计算器</h2>
    <div class="tabs tabs-lift">
      <input
        checked
        type="radio"
        name="my_tabs_3"
        class="tab"
        aria-label="复式"
      />
      <div class="tab-content bg-base-100 border-base-300 p-6">
        <CompoundBet />
      </div>

      <input type="radio" name="my_tabs_3" class="tab" aria-label="胆拖" />
      <div class="tab-content bg-base-100 border-base-300 p-6">
        <p>胆拖</p>
      </div>
    </div>
  </main>
</template>
