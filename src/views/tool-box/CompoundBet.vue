<script setup>
import { ref, computed } from 'vue'
import {
  DRAWN_NUMBER_COUNT,
  LOTTERY_NUMBER_COUNT,
  PLAY_TYPES,
  calculateRegularPrizeCounts,
  calculateStakeAmount,
  combine,
} from '@/utils/lottery-rules'
import { getAwardDetails, getAwardTotal } from './components/award-detail/utils'

import BetSelection from './components/bet-selection/BetSelection.vue'
import NumberSelection from './components/number-selection/NumberSelection.vue'
import NumberSelectionDrawer from './components/number-selection/NumberSelectionDrawer.vue'
import AwardDetail from './components/award-detail/AwardDetail.vue'

const selectedPlayType = ref(PLAY_TYPES[0])
const betNumber = ref(1)
const hitNumber = ref(0)
const activeSelectionKey = ref('betNumber')
const isSelectionDrawerOpen = ref(false)

const playSize = computed(() => selectedPlayType.value.size)
const betOptionalNumbers = computed(() => getRange(playSize.value, LOTTERY_NUMBER_COUNT))
const hitOptionalNumbers = computed(() => getRange(0, Math.min(betNumber.value, DRAWN_NUMBER_COUNT)))
const betCount = computed(() => combine(betNumber.value, playSize.value))
const betAmount = computed(() => calculateStakeAmount(betCount.value, 1))
const prizeCounts = computed(() => getPrizeCounts())
const prizeDetails = computed(() => getAwardDetails(selectedPlayType.value.value, prizeCounts.value))
const totalBonus = computed(() => getAwardTotal(prizeDetails.value))
const selectionConfig = computed(() => getSelectionConfig())

function handleBetSelectionSelected(playType) {
  selectedPlayType.value = playType
}

function handleBetNumberSelected(number) {
  betNumber.value = number
}

function handleHitNumberSelected(number) {
  hitNumber.value = number
}

function openSelectionDrawer(selectionKey) {
  activeSelectionKey.value = selectionKey
  isSelectionDrawerOpen.value = true
}

function handleDrawerNumberSelected(number) {
  if (activeSelectionKey.value === 'betNumber') {
    handleBetNumberSelected(number)
    return
  }

  handleHitNumberSelected(number)
}

function getPrizeCounts() {
  return calculateRegularPrizeCounts({
    playType: selectedPlayType.value.value,
    selectedCount: betNumber.value,
    hitCount: hitNumber.value,
  })
}

function getRange(start, end) {
  if (end < start) return []

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

function getSelectionConfig() {
  if (activeSelectionKey.value === 'betNumber') {
    return {
      title: '选择投注个数',
      optionalNumbers: betOptionalNumbers.value,
      selectedNumber: betNumber.value,
    }
  }

  return {
    title: '选择命中个数',
    optionalNumbers: hitOptionalNumbers.value,
    selectedNumber: hitNumber.value,
  }
}
</script>

<template>
  <section>
    <BetSelection :startBetIndex="1" @select="handleBetSelectionSelected"/>

    <div class="flex items-start justify-between gap-4">
      <NumberSelection
        label="投注个数"
        selection-title="选择投注个数"
        :selected-number="betNumber"
        @open="openSelectionDrawer('betNumber')"
      />
      <NumberSelection
        label="命中个数"
        selection-title="选择命中个数"
        :selected-number="hitNumber"
        @open="openSelectionDrawer('hitNumber')"
      />
    </div>

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
