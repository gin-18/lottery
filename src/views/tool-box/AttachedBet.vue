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

  betDanOptionalNumbers.value = genBetDanOptionalNumbers()
  betTuoOptionalNumbers.value = genBetTuoOptionalNumbers()
  hitDanOptionalNumbers.value = genHitDanOptionalNumbers()
  hitTuoOptionalNumbers.value = genHitTuoOptionalNumbers()
}

/** 投注个数 */
// ==== 胆码 ====
const betDanNumber = ref(1) // 胆码投注个数
const betDanOptionalNumbers = ref([]) // 可选的胆码投注个数
// 胆码投注个数选中处理函数
function handleBetDanNumberSelected(number) {
  betDanNumber.value = number
  betTuoOptionalNumbers.value = genBetTuoOptionalNumbers()
  hitDanOptionalNumbers.value = genHitDanOptionalNumbers()
  hitTuoOptionalNumbers.value = genHitTuoOptionalNumbers()
}
// 生成胆码投注个数可选号码
function genBetDanOptionalNumbers() {
  return Array.from({ length: selectedBetIndex.value + 1 }, (_, index) => index + 1)
}
// ==== 拖码 ====
const betTuoNumber = ref(1) // 拖码投注个数
const betTuoOptionalNumbers = ref([]) // 可选的拖码投注个数
// 拖码投注个数选中处理函数
function handleBetTuoNumberSelected(number) {
  betTuoNumber.value = number
  hitTuoOptionalNumbers.value = genHitTuoOptionalNumbers()
}
// 生成拖码投注个数可选号码
function genBetTuoOptionalNumbers() {
  const length = 80 - (selectedBetIndex.value + 2)
  return Array.from({ length }, (_, index) => index + 3 + selectedBetIndex.value - betDanNumber.value)
}

/** 命中个数 */
// ==== 胆码 ====
const hitDanNumber = ref(0) // 胆码命中个数
const hitDanOptionalNumbers = ref([]) // 可选的胆码命中个数
// 胆码命中个数选中处理函数
function handleHitDanNumberSelected(number) {
  hitDanNumber.value = number
}
// 生成胆码命中个数可选号码
function genHitDanOptionalNumbers() {
  return Array.from({ length: betDanNumber.value + 1 }, (_, index) => index)
}
// ==== 拖码 ====
const hitTuoNumber = ref(0) // 拖码命中个数
const hitTuoOptionalNumbers = ref([]) // 可选的拖码命中个数
// 拖码命中个数选中处理函数
function handleHitTuoNumberSelected(number) {
  hitTuoNumber.value = number
}
// 生成拖码命中个数可选号码
function genHitTuoOptionalNumbers() {
  return Array.from({ length: betTuoNumber.value + 1 }, (_, index) => index)
}

// ==== 计算奖金 ====
const betCount = computed(() => comb(betTuoNumber.value, (selectedBetIndex.value + 2 - betDanNumber.value))) // 投注数量
const betAmount = computed(() => betCount.value * 2) // 投注金额
const totalBonus = ref(0) // 中奖金额
const prizeDetails = ref([]) // 中奖详情
// 胆拖投注计算函数
function calculateBonus() {
  const prizeRules = prizeTables[selectedBetIndex.value + 1] // 选中玩法对应的中奖规则
  // 计算投注数量和金额
  const neededFromTuo = selectedBetIndex.value - betDanNumber.value;
  const details = [];
  let total = 0;

  for (const [t, prize] of Object.entries(prizeRules)) {
    const tInt = parseInt(t);

    // 对于胆拖投注，总命中数 = 胆码命中 + 拖码命中
    // 但每注彩票的胆码是固定的，所以实际中奖情况取决于胆码和拖码的组合
    if (tInt < hitDanNumber.value) continue;  // 总命中数不能小于胆码命中数

    const neededFromTuoHits = tInt - hitDanNumber.value;
    if (neededFromTuoHits < 0 || neededFromTuoHits > hitTuoNumber.value || neededFromTuoHits > neededFromTuo) {
      continue;
    }

    const nonHitTuo = betTuoNumber.value - hitTuoNumber.value;
    const neededNonHits = neededFromTuo - neededFromTuoHits;

    if (neededNonHits < 0 || neededNonHits > nonHitTuo) {
      continue;
    }

    const betsForThisPrize = comb(hitTuoNumber.value, neededFromTuoHits) * comb(nonHitTuo, neededNonHits);
    const prizeTotal = betsForThisPrize * prize;

    total += prizeTotal;

    details.push({
      level: `中${t}个`,
      condition: `胆码中${hitDanNumber.value}个 + 拖码中${neededFromTuoHits}个`,
      prizePerBet: prize,
      bets: betsForThisPrize,
      total: prizeTotal
    });
  }

  totalBonus.value = total
  prizeDetails.value = details
}

watch([betDanNumber, betTuoNumber, hitDanNumber, hitTuoNumber], () => {
  calculateBonus()
})

onMounted(() => {
  betDanOptionalNumbers.value = genBetDanOptionalNumbers()
  betTuoOptionalNumbers.value = genBetTuoOptionalNumbers()

  hitDanOptionalNumbers.value = genHitDanOptionalNumbers()
  hitTuoOptionalNumbers.value = genHitTuoOptionalNumbers()

  calculateBonus()
})
</script>

<template>
  <section>
    <BetSelection :startBetIndex="2" @select="handleBetSelectionSelected"/>

      <section>
        <p class="font-semibold">投注个数</p>
        <div class="flex justify-between">
          <div class="flex gap-2 items-center">
            <span>胆码</span>
            <NumberSelection selection-title="选择胆码投注个数" :optional-numbers="betDanOptionalNumbers" @select="handleBetDanNumberSelected"/>
          </div>
          <div class="flex gap-2 items-center">
            <span>拖码</span>
            <NumberSelection selection-title="选择拖码投注个数" :optional-numbers="betTuoOptionalNumbers" @select="handleBetTuoNumberSelected"/>
          </div>
        </div>
      </section>

      <section>
        <p class="font-semibold">命中个数</p>
        <div class="flex justify-between">
          <div class="flex gap-2 items-center">
            <span>胆码</span>
            <NumberSelection selection-title="选择胆码命中个数" :optional-numbers="hitDanOptionalNumbers" @select="handleHitTuoNumberSelected"/>
          </div>
          <div class="flex gap-2 items-center">
            <span>拖码</span>
            <NumberSelection selection-title="选择拖码命中个数" :optional-numbers="hitTuoOptionalNumbers" @select="handleHitTuoNumberSelected"/>
          </div>
        </div>
      </section>

    <AwardDetail :bet-count="betCount" :bet-amount="betAmount" :total-bonus="totalBonus" :prize-details="prizeDetails" />
  </section>
</template>
