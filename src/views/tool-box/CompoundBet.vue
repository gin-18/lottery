<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { prizeTables, comb } from './components/award-detail/utils'

import BetSelection from './components/bet-selection/BetSelection.vue'
import NumberSelection from './components/number-selection/NumberSelection.vue'
import AwardDetail from './components/award-detail/AwardDetail.vue'

// ==== 选法 ====
const selectedBetIndex = ref(0) // 选中玩法的下标
// 玩法选中的处理函数
function handleBetSelectionSelected(index) {
  selectedBetIndex.value = index
  betOptionalNumbers.value = genBetOptionalNumbers()
  hitOptionalNumbers.value = genHitOptionalNumbers()
}

// ==== 投注个数 ====
const betNumber = ref(1) // 投注个数
const betOptionalNumbers = ref([]) // 可选的投注个数
// 投注个数选中处理函数
function handleBetNumberSelected(number) {
  betNumber.value = number
  hitOptionalNumbers.value = genHitOptionalNumbers()
}
// 生成投注个数可选号码
function genBetOptionalNumbers() {
  const numbers = Array.from({ length: 80 }, (_, index) => index + 1)
  return numbers.slice(selectedBetIndex.value, numbers.length + 1)
}

// ==== 命中个数 ====
const hitNumber = ref(0) // 命中个数
const hitOptionalNumbers = ref([]) // 可选的命中个数
// 命中个数选中处理函数
function handleHitNumberSelected(number) {
  hitNumber.value = number
}
// 生成命中个数可选号码
function genHitOptionalNumbers() {
  if (betNumber.value >= 20) return Array.from({ length: 21 }, (_, index) => index)
  return Array.from({ length: betNumber.value + 1 }, (_, index) => index)
}

// ==== 计算奖金 ====
const betCount = computed(() => comb(betNumber.value, selectedBetIndex.value + 1)) // 投注数量
const betAmount = computed(() => betCount.value * 2) // 投注金额
const totalBonus = ref(0) // 中奖金额
const prizeDetails = ref([]) // 中奖详情
// 计算中奖结果
function calculateBonus() {
  const prizeRules = prizeTables[selectedBetIndex.value + 1] // 选中玩法对应的中奖规则
  const details = []
  let total = 0

  for (const [t, prize] of Object.entries(prizeRules)) {
    const tInt = parseInt(t)

    if (tInt <= hitNumber.value && selectedBetIndex.value + 1 - tInt <= betNumber.value - hitNumber.value) {
      const betsForThisPrize = comb(hitNumber.value, tInt) * comb(betNumber.value - hitNumber.value, selectedBetIndex.value + 1 - tInt)
      const prizeTotal = betsForThisPrize * prize

      total += prizeTotal

      details.push({
        level: `中${t}个`,
        prizePerBet: prize,
        bets: betsForThisPrize,
        total: prizeTotal,
      })
    }
  }

  totalBonus.value = total
  prizeDetails.value = details
}

watch([betNumber, hitNumber], (val) => {
  calculateBonus()
})

onMounted(() => {
  betOptionalNumbers.value = genBetOptionalNumbers()
  hitOptionalNumbers.value = genHitOptionalNumbers()
  calculateBonus()
})
</script>

<template>
  <section>
    <BetSelection :startBetIndex="1" @select="handleBetSelectionSelected"/>

    <div class="flex justify-between">
      <NumberSelection label="投注个数" selection-title="选择投注个数" :optional-numbers="betOptionalNumbers" @select="handleBetNumberSelected"/>
      <NumberSelection label="命中个数" selection-title="选择命中个数" :optional-numbers="hitOptionalNumbers" @select="handleHitNumberSelected" />
    </div>

    <AwardDetail :bet-count="betCount" :bet-amount="betAmount" :total-bonus="totalBonus" :prize-details="prizeDetails" />
  </section>
</template>
