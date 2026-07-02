<script setup>
import { computed, ref } from 'vue'
import DetailDescriptions from '@/components/content/DetailDescriptions.vue'
import LoDrawer from '@/components/content/LoDrawer.vue'
import MonthlySummaryChart from '@/views/betting-ledger/components/MonthlySummaryChart.vue'

const MONTHS_IN_YEAR = 12
const DEFAULT_YEAR_OPTION_COUNT = 10

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  monthlyStats: {
    type: Array,
    required: true,
  },
})

defineEmits(['update:isOpen'])

const selectedSummaryYear = ref(new Date().getFullYear())
const summaryYearOptions = computed(() => getSummaryYearOptions())
const selectedYearStats = computed(() => getYearStats(selectedSummaryYear.value))
const selectedYearTotals = computed(() => getYearTotals(selectedYearStats.value))
const totalDetailItems = computed(() => getTotalDetailItems(selectedYearTotals.value))

function formatMoney(amount) {
  return Number(amount).toFixed(2)
}

function getRevenueClass(amount) {
  return amount >= 0 ? 'text-success' : 'text-error'
}

function getSummaryYearOptions() {
  const years = props.monthlyStats.map((record) => Number(record.month.slice(0, 4)))
  const currentYear = new Date().getFullYear()
  const fallbackYears = getFallbackYears(currentYear)

  return [...new Set([...fallbackYears, ...years])].sort((first, second) => second - first)
}

function getFallbackYears(currentYear) {
  return Array.from(
    { length: DEFAULT_YEAR_OPTION_COUNT },
    (_, index) => currentYear - index,
  )
}

function getYearStats(year) {
  const statsByMonth = new Map(props.monthlyStats.map((item) => [item.month, item]))

  return Array.from({ length: MONTHS_IN_YEAR }, (_, index) => {
    const month = `${year}-${String(index + 1).padStart(2, '0')}`
    return normalizeMonthlyStat(month, statsByMonth.get(month))
  })
}

function normalizeMonthlyStat(month, stats) {
  return {
    month,
    label: `${Number(month.slice(5, 7))}月`,
    recordCount: stats?.recordCount ?? 0,
    stakeAmount: stats?.stakeAmount ?? 0,
    prizeAmount: stats?.prizeAmount ?? 0,
    revenue: stats?.revenue ?? 0,
    hasUnconfirmedPrize: Boolean(stats?.hasUnconfirmedPrize),
  }
}

function getYearTotals(stats) {
  return stats.reduce(
    (totals, item) => ({
      recordCount: totals.recordCount + item.recordCount,
      stakeAmount: totals.stakeAmount + item.stakeAmount,
      prizeAmount: totals.prizeAmount + item.prizeAmount,
      revenue: totals.revenue + item.revenue,
      hasUnconfirmedPrize: totals.hasUnconfirmedPrize || item.hasUnconfirmedPrize,
    }),
    { recordCount: 0, stakeAmount: 0, prizeAmount: 0, revenue: 0, hasUnconfirmedPrize: false },
  )
}

function getTotalDetailItems(totals) {
  return [
    { key: 'recordCount', label: '记录数', value: totals.recordCount },
    { key: 'stakeAmount', label: '投注成本', value: `¥${formatMoney(totals.stakeAmount)}` },
    { key: 'prizeAmount', label: '已确认奖金', value: `¥${formatMoney(totals.prizeAmount)}` },
    { key: 'revenue', label: '营收', value: `¥${formatMoney(totals.revenue)}` },
  ]
}
</script>

<template>
  <LoDrawer
    :model-value="isOpen"
    title="月份汇总"
    panel-class="md:w-1/3 lg:w-1/4"
    @update:model-value="$emit('update:isOpen', $event)"
  >
    <section v-if="selectedYearTotals.hasUnconfirmedPrize" class="flex items-center gap-2 text-warning">
      <span class="icon-[octicon--unmute-16]"></span>
      <p>该年份包含浮动奖金记录，中奖金额与营收仅统计已确认奖金。</p>
    </section>

    <fieldset class="fieldset w-full">
      <legend class="fieldset-legend">年份</legend>
      <select v-model.number="selectedSummaryYear" class="select select-bordered w-full">
        <option v-for="year in summaryYearOptions" :key="year" :value="year">{{ year }}</option>
      </select>
    </fieldset>

    <DetailDescriptions class="mt-4" bordered :items="totalDetailItems" :columns="1">
      <template #value-revenue="{ item }">
        <span class="font-medium" :class="getRevenueClass(selectedYearTotals.revenue)">
          {{ item.value }}
        </span>
      </template>
    </DetailDescriptions>

    <MonthlySummaryChart
      class="mt-4"
      chart-id="betting-monthly-summary-chart"
      :stats="selectedYearStats"
      :is-visible="isOpen"
    />
  </LoDrawer>
</template>
