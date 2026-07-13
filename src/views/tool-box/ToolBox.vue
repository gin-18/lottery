<script setup>
import CompoundBet from './CompoundBet.vue'
import AttachedBet from './AttachedBet.vue'
</script>

<template>
  <section>
    <h2>奖金计算器</h2>
    <div class="flex items-center gap-2 text-warning">
      <span class="icon-[octicon--unmute-16]"></span>
      <p>计算结果仅供参考，中奖情况请以官方公告以及实际兑奖结果为准</p>
    </div>
    <div role="tablist" class="tabs tabs-lifted">
      <input
        checked
        type="radio"
        name="my_tabs_2"
        class="tab whitespace-nowrap"
        aria-label="复式"
      />
      <div class="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <CompoundBet />
      </div>

      <input type="radio" name="my_tabs_2" class="tab whitespace-nowrap" aria-label="胆拖" />
      <div class="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <AttachedBet />
      </div>
    </div>
  </section>
</template>
