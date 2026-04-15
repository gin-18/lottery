<script setup>
import Header from '@/components/header/Header.vue'
import CompoundBet from './CompoundBet.vue'
import AttachedBet from './AttachedBet.vue'
</script>

<template>
  <Header />

  <main>
    <section>
      <h2>奖金计算器</h2>
      <div class="flex items-center gap-2 text-warning">
        <span class="icon-[octicon--unmute-16]"></span>
        <p>计算结果仅供参考，中奖情况请以官方公告以及实际兑奖结果为准</p>
      </div>
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
          <AttachedBet />
        </div>
      </div>
    </section>
  </main>
</template>
