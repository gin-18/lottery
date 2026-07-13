<script setup>
import { ref, computed } from 'vue'
import {
  DRAWN_NUMBER_COUNT,
  LOTTERY_NUMBER_COUNT,
  PLAY_TYPES,
  calculateDantuoPrizeCounts,
  calculateStakeAmount,
  combine,
} from '@/utils/lottery-rules'
import { getAwardDetails, getAwardTotal } from './components/award-detail/utils'

import BetSelection from './components/bet-selection/BetSelection.vue'
import NumberSelection from './components/number-selection/NumberSelection.vue'
import NumberSelectionDrawer from './components/number-selection/NumberSelectionDrawer.vue'
import AwardDetail from './components/award-detail/AwardDetail.vue'

const selectedPlayType = ref(PLAY_TYPES[1])
const betDanNumber = ref(1)
const betTuoNumber = ref(1)
const hitDanNumber = ref(0)
const hitTuoNumber = ref(0)
const activeSelectionKey = ref('betDanNumber')
const isSelectionDrawerOpen = ref(false)

const playSize = computed(() => selectedPlayType.value.size)
const dragPickSize = computed(() => playSize.value - betDanNumber.value)
const betDanOptionalNumbers = computed(() => getRange(1, playSize.value - 1))
const betTuoOptionalNumbers = computed(() => getTuoBetOptions())
const hitDanOptionalNumbers = computed(() => getRange(0, Math.min(betDanNumber.value, DRAWN_NUMBER_COUNT)))
const hitTuoOptionalNumbers = computed(() => getHitTuoOptions())
const betCount = computed(() => combine(betTuoNumber.value, dragPickSize.value))
const betAmount = computed(() => calculateStakeAmount(betCount.value, 1))
const prizeCounts = computed(() => getPrizeCounts())
const prizeDetails = computed(() => getAwardDetails(selectedPlayType.value.value, prizeCounts.value))
const totalBonus = computed(() => getAwardTotal(prizeDetails.value))
const selectionConfig = computed(() => getSelectionConfig())

function handleBetSelectionSelected(playType) {
  selectedPlayType.value = playType
}

function handleBetDanNumberSelected(number) {
  betDanNumber.value = number
}

function handleBetTuoNumberSelected(number) {
  betTuoNumber.value = number
}

function handleHitDanNumberSelected(number) {
  hitDanNumber.value = number
}

function handleHitTuoNumberSelected(number) {
  hitTuoNumber.value = number
}

function openSelectionDrawer(selectionKey) {
  activeSelectionKey.value = selectionKey
  isSelectionDrawerOpen.value = true
}

function handleDrawerNumberSelected(number) {
  const selectionHandlers = {
    betDanNumber: handleBetDanNumberSelected,
    betTuoNumber: handleBetTuoNumberSelected,
    hitDanNumber: handleHitDanNumberSelected,
    hitTuoNumber: handleHitTuoNumberSelected,
  }

  selectionHandlers[activeSelectionKey.value](number)
}

function getTuoBetOptions() {
  const minDragCount = Math.max(1, dragPickSize.value)
  return getRange(minDragCount, LOTTERY_NUMBER_COUNT - betDanNumber.value)
}

function getHitTuoOptions() {
  const maxHitCount = DRAWN_NUMBER_COUNT - hitDanNumber.value
  return getRange(0, Math.min(betTuoNumber.value, maxHitCount))
}

function getPrizeCounts() {
  return calculateDantuoPrizeCounts({
    playType: selectedPlayType.value.value,
    bankerCount: betDanNumber.value,
    dragCount: betTuoNumber.value,
    bankerHitCount: hitDanNumber.value,
    dragHitCount: hitTuoNumber.value,
  })
}

function getRange(start, end) {
  if (end < start) return []

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function getSelectionConfig() {
  const selectionConfigs = {
    betDanNumber: {
      title: '选择胆码投注个数',
      optionalNumbers: betDanOptionalNumbers.value,
      selectedNumber: betDanNumber.value,
    },
    betTuoNumber: {
      title: '选择拖码投注个数',
      optionalNumbers: betTuoOptionalNumbers.value,
      selectedNumber: betTuoNumber.value,
    },
    hitDanNumber: {
      title: '选择胆码命中个数',
      optionalNumbers: hitDanOptionalNumbers.value,
      selectedNumber: hitDanNumber.value,
    },
    hitTuoNumber: {
      title: '选择拖码命中个数',
      optionalNumbers: hitTuoOptionalNumbers.value,
      selectedNumber: hitTuoNumber.value,
    },
  }

  return selectionConfigs[activeSelectionKey.value]
}
</script>

<template>
  <section>
    <BetSelection :startBetIndex="2" @select="handleBetSelectionSelected"/>

      <section>
        <p class="font-semibold">投注个数</p>
        <div class="flex flex-wrap justify-between gap-4">
          <div class="flex shrink-0 items-center gap-2">
            <span class="whitespace-nowrap">胆码</span>
            <NumberSelection
              selection-title="选择胆码投注个数"
              :selected-number="betDanNumber"
              @open="openSelectionDrawer('betDanNumber')"
            />
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span class="whitespace-nowrap">拖码</span>
            <NumberSelection
              selection-title="选择拖码投注个数"
              :selected-number="betTuoNumber"
              @open="openSelectionDrawer('betTuoNumber')"
            />
          </div>
        </div>
      </section>

      <section>
        <p class="font-semibold">命中个数</p>
        <div class="flex flex-wrap justify-between gap-4">
          <div class="flex shrink-0 items-center gap-2">
            <span class="whitespace-nowrap">胆码</span>
            <NumberSelection
              selection-title="选择胆码命中个数"
              :selected-number="hitDanNumber"
              @open="openSelectionDrawer('hitDanNumber')"
            />
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span class="whitespace-nowrap">拖码</span>
            <NumberSelection
              selection-title="选择拖码命中个数"
              :selected-number="hitTuoNumber"
              @open="openSelectionDrawer('hitTuoNumber')"
            />
          </div>
        </div>
      </section>

    <AwardDetail :bet-count="betCount" :bet-amount="betAmount" :total-bonus="totalBonus" :prize-details="prizeDetails" />

    <NumberSelectionDrawer
      v-model="isSelectionDrawerOpen"
      :title="selectionConfig.title"
      :optional-numbers="selectionConfig.optionalNumbers"
      :selected-number="selectionConfig.selectedNumber"
      @select="handleDrawerNumberSelected"
    />
  </section>
</template>
