<script setup>
import Ball from '@/components/content/Ball.vue'
import { getPlayLabel, getSelectionModeLabel } from '@/utils/lottery-rules'
import { getGroupDisplaySections } from '../utils/record-number-display'

defineProps({
  records: {
    type: Array,
    required: true,
  },
})

defineEmits(['edit', 'delete', 'settle', 'view'])

function formatMoney(amount) {
  return Number(amount).toFixed(2)
}

function formatBallNumber(number) {
  return String(number).padStart(2, '0')
}

function getRevenueClass(record) {
  const revenue = record.settlement?.revenue ?? -record.totalStakeAmount
  return revenue >= 0 ? 'text-success' : 'text-error'
}

function getPreviewGroups(record) {
  return record.items.slice(0, 3).flatMap((item) =>
    item.numberGroups.slice(0, 2).map((group) => ({
      key: `${item.id}-${group.id}`,
      label: `${getPlayLabel(item.playType)} / ${getSelectionModeLabel(item.selectionMode)}`,
      sections: getGroupDisplaySections(item, group),
      hitNumbers: group.settlement?.hitNumbers ?? [],
    })),
  )
}

function getNumberColor(hitNumbers, number) {
  if (hitNumbers.includes(number)) return 'bg-success'
  return 'bg-error'
}

function getNumberGroupCount(record) {
  return record.items.reduce((count, item) => count + item.numberGroups.length, 0)
}

function getUnconfirmedPrizeSummary(record) {
  const entries = record.settlement?.unconfirmedPrizeHits ?? []
  if (!entries.length) return ''

  return entries
    .map((entry) => `${getPlayLabel(entry.playType)}中${entry.hitCount}`)
    .join('、')
}

</script>

<template>
  <div v-if="!records.length" class="rounded-box border border-base-300 p-8 text-center text-base-content/60">
    暂无记录
  </div>

  <template v-else>
    <article
      v-for="record in records"
      :key="record.id"
      role="button"
      tabindex="0"
      class="cursor-pointer rounded-box border border-base-300 bg-base-100 p-4 transition-colors md:hover:bg-base-200"
      @click="$emit('view', record)"
      @keydown.enter="$emit('view', record)"
      @keydown.space.prevent="$emit('view', record)"
    >
      <div class="grid gap-4">
        <div class="flex justify-between">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="m-0 text-base font-semibold">第{{ record.issue }}期</h2>
            <span v-if="record.settlement" class="badge badge-primary">已结算</span>
            <span v-else class="badge badge-warning">待结算</span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="btn btn-xs btn-primary" type="button" :disabled="record.settlement" @click.stop="$emit('settle', record)">结算</button>
            <button class="btn btn-xs btn-primary" type="button" @click.stop="$emit('edit', record)">编辑</button>
            <button class="btn btn-xs btn-error" type="button" @click.stop="$emit('delete', record.id)">删除</button>
          </div>
        </div>

        <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-base-content/70">
          <span>{{ record.betDate }}</span>
          <span>{{ record.items.length }} 个投注项 / {{ getNumberGroupCount(record) }} 组号码</span>
          <span>{{ record.totalStakeCount }} 注</span>
          <span>¥{{ formatMoney(record.totalStakeAmount) }}</span>
        </div>
      </div>

      <div class="mt-4 grid gap-4">
        <div
          v-for="group in getPreviewGroups(record)"
          :key="group.key"
          class="grid gap-2 rounded-box border border-base-300 p-4"
        >
          <div class="text-xs text-base-content/60">{{ group.label }}</div>
          <div v-if="group.sections.length === 2" class="flex flex-wrap items-start gap-2">
            <div class="flex flex-wrap gap-2">
              <Ball
                v-for="number in group.sections[0].numbers"
                :key="`${group.key}-${group.sections[0].key}-${number}`"
                :num="formatBallNumber(number)"
                :color="getNumberColor(group.hitNumbers, number)"
              />
            </div>
            <div>/</div>
            <div class="flex flex-wrap gap-2">
              <Ball
                v-for="number in group.sections[1].numbers"
                :key="`${group.key}-${group.sections[1].key}-${number}`"
                :num="formatBallNumber(number)"
                :color="getNumberColor(group.hitNumbers, number)"
              />
            </div>
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <Ball
              v-for="number in group.sections[0].numbers"
              :key="`${group.key}-${group.sections[0].key}-${number}`"
              :num="formatBallNumber(number)"
              :color="getNumberColor(group.hitNumbers, number)"
            />
          </div>
        </div>
      </div>

      <div v-if="record.settlement" class="mt-4 border-t border-base-300 pt-4">
        <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          <span>
            中奖 {{ record.settlement.winningStakeCount }} 注 /
            已确认 ¥{{ formatMoney(record.settlement.prizeAmount) }}
          </span>
          <span :class="getRevenueClass(record)">营收 ¥{{ formatMoney(record.settlement.revenue) }}</span>
          <span v-if="record.settlement.hasUnconfirmedPrize" class="text-warning">
            {{ getUnconfirmedPrizeSummary(record) }}含浮动奖金，最终以官方公布为准
          </span>
        </div>
      </div>
    </article>
  </template>
</template>
