<script setup>
import { formatPrice } from './utils'

const props = defineProps({
  betCount: {
    type: Number
  },
  betAmount: {
    type: Number
  },
  totalBonus: {
    type: Number
  },
  prizeDetails: {
    type: Array
  }
})

function getPrizePerBetText(item) {
  return item.isFloating ? item.prizeDisplayValue : formatPrice(item.prizePerBet)
}

function getPrizeTotalText(item) {
  return item.isFloating ? '待确认' : formatPrice(item.total)
}
</script>

<template>
  <p class="text-base font-semibold">获奖情况</p>
  <div>
    <p>
      投注金额：共 <span class="text-error">{{ formatPrice(props.betCount) }}</span> 注; 共 <span class="text-error">{{ formatPrice(props.betAmount) }}</span> 元
    </p>
    <p>
      已确认中奖金额: <span class="text-error">{{ formatPrice(props.totalBonus) }}</span> 元; 盈利: <span class="text-error">{{ formatPrice((props.totalBonus - props.betAmount)) }}</span> 元
    </p>
    <table class="!table">
      <thead>
        <tr>
          <th>奖级</th>
          <th>单注奖金</th>
          <th>中奖注数</th>
          <th>奖金小计</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in props.prizeDetails" :key="index">
          <td>{{ item.level }}</td>
          <td>{{ getPrizePerBetText(item) }}</td>
          <td>{{ formatPrice(item.bets) }}</td>
          <td>{{ getPrizeTotalText(item) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
