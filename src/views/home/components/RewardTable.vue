<script setup>
import { computed } from 'vue'
import { PLAY_TYPES, PRIZE_RULES, getPrizeDisplayValue } from '@/utils/lottery-rules'

const rewardRows = computed(() =>
  [...PLAY_TYPES]
    .reverse()
    .flatMap((playType) => getRewardRows(playType)),
)

function getRewardRows(playType) {
  const rules = PRIZE_RULES[playType.value]
  const hitCounts = Object.keys(rules)
    .map((hitCount) => Number(hitCount))
    .sort((first, second) => second - first)

  return hitCounts.map((hitCount, index) => {
    return {
      game: playType.label,
      condition: `中${hitCount}`,
      price: getPrizeDisplayValue(playType.value, hitCount),
      size: hitCounts.length,
      shouldShowGame: index === 0,
    }
  })
}

function getShowIndex() {
  rewards.value.forEach((_item, index) => {
    if (index > 0) {
      showIndex.value.push(
        showIndex.value[index - 1] + rewards.value[index - 1].conditions.length,
      )
    }
  })
}
</script>

<template>
  <table class="!table">
    <thead>
      <tr>
        <th scope="col">玩法</th>
        <th scope="col">中奖条件</th>
        <th scope="col">奖金（元）</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in rewardRows" :key="`${item.game}-${item.condition}`">
        <td :rowspan="item.size" v-show="item.shouldShowGame">
          {{ item.game }}
        </td>
        <td>{{ item.condition }}</td>
        <td>{{ item.price }}</td>
      </tr>
    </tbody>
  </table>
</template>
