<script setup>
import { computed } from 'vue'
import Ball from '@/components/content/Ball.vue'
import DetailDescriptions from '@/components/content/DetailDescriptions.vue'
import LoDrawer from '@/components/content/LoDrawer.vue'
import { getPlayLabel, getSelectionModeLabel } from '@/utils/lottery-rules'
import { getGroupDisplaySections } from '../utils/record-number-display'

const props = defineProps({
  record: {
    type: [Object, null],
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['update:isOpen'])

const detailItems = computed(() => getDetailItems(props.record))

function formatMoney(amount) {
  return Number(amount).toFixed(2)
}

function formatBallNumber(number) {
  return String(number).padStart(2, '0')
}

function getRevenueClass(amount) {
  return amount >= 0 ? 'text-success' : 'text-error'
}

function getUnconfirmedPrizeNoticeLines(settlement) {
  return (settlement?.unconfirmedPrizeHits ?? []).map((entry) => {
    return `${getPlayLabel(entry.playType)}中${entry.hitCount}：${entry.notice}`
  })
}

function getSettlementStatusLabel(record) {
  return record?.settlement ? '已结算' : '待结算'
}

function getNumberColor(group, number) {
  if (group.settlement?.hitNumbers.includes(number)) return 'bg-success'
  return 'bg-error'
}

function getNumberGroupCount(record) {
  return record.items.reduce((count, item) => count + item.numberGroups.length, 0)
}

function getDetailItems(record) {
  if (!record) return []

  const settlement = record.settlement

  return [
    { key: 'issue', label: '投注期次', value: `第${record.issue}期` },
    { key: 'betDate', label: '投注日期', value: record.betDate },
    { key: 'settlementStatus', label: '结算情况', value: getSettlementStatusLabel(record) },
    { key: 'itemCount', label: '投注项', value: `${record.items.length} 个` },
    { key: 'groupCount', label: '号码组', value: `${getNumberGroupCount(record)} 组` },
    { key: 'betCount', label: '总注数', value: `${record.totalStakeCount} 注` },
    { key: 'totalStakeAmount', label: '总成本', value: `¥${formatMoney(record.totalStakeAmount)}` },
    {
      key: 'prizeAmount',
      label: '已确认奖金',
      value: settlement ? `¥${formatMoney(settlement.prizeAmount)}` : '',
    },
    {
      key: 'winningStakeCount',
      label: '中奖注数',
      value: settlement ? `${settlement.winningStakeCount} 注` : '',
    },
    {
      key: 'winningItemCount',
      label: '中奖投注项',
      value: settlement ? `${settlement.winningItemCount} 个` : '',
    },
    {
      key: 'revenue',
      label: '营收',
      value: settlement ? `¥${formatMoney(settlement.revenue)}` : '',
    },
    {
      key: 'unconfirmedPrize',
      label: '浮动奖金',
      value: settlement?.hasUnconfirmedPrize ? getUnconfirmedPrizeNoticeLines(settlement).join('\n') : '',
    },
  ]
}
</script>

<template>
  <LoDrawer
    :model-value="isOpen"
    title="投注详情"
    panel-class="md:w-5/6 lg:w-3/4"
    @update:model-value="$emit('update:isOpen', $event)"
  >
    <div v-if="record" class="grid gap-6">
      <section>
        <h3 class="m-0 mb-4 text-base font-semibold">投注信息</h3>
        <DetailDescriptions bordered :items="detailItems" :columns="1">
          <template #value-settlementStatus="{ item }">
            <span class="badge" :class="record.settlement ? 'badge-success' : 'badge-warning'">
              {{ item.value }}
            </span>
          </template>
          <template #value-revenue="{ item }">
            <span :class="record.settlement ? getRevenueClass(record.settlement.revenue) : ''">
              {{ item.value || '--' }}
            </span>
          </template>
          <template #value-unconfirmedPrize="{ item }">
            <div v-if="item.value" class="grid gap-2 text-sm text-warning">
              <p
                v-for="line in item.value.split('\n')"
                :key="line"
                class="m-0"
              >
                {{ line }}
              </p>
            </div>
            <span v-else>--</span>
          </template>
        </DetailDescriptions>
      </section>

      <section>
        <h3 class="m-0 mb-4 text-base font-semibold">码号信息</h3>
        <div class="grid gap-4">
          <div
            v-for="item in record.items"
            :key="item.id"
            class="grid gap-4 rounded-box border border-base-300 p-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="grid gap-2">
                <div class="font-medium">
                  {{ getPlayLabel(item.playType) }} / {{ getSelectionModeLabel(item.selectionMode) }}
                </div>
                <div class="text-sm text-base-content/70">
                  {{ item.numberGroups.length }} 组号码 / {{ item.stakeCount }} 注 / {{ item.multiplier }} 倍
                </div>
              </div>
              <div class="text-sm font-medium">¥{{ formatMoney(item.stakeAmount) }}</div>
            </div>

            <div class="grid gap-4">
              <div
                v-for="group in item.numberGroups"
                :key="group.id"
                class="grid gap-2 rounded-box border border-base-300 p-4"
              >
                <div class="flex flex-wrap items-center justify-between gap-2 text-sm text-base-content/70">
                  <span>{{ group.stakeCount }} 注</span>
                  <span>¥{{ formatMoney(group.stakeAmount) }}</span>
                </div>

                <div class="grid gap-4">
                  <template
                    v-for="sections in [getGroupDisplaySections(item, group)]"
                    :key="`${group.id}-sections`"
                  >
                    <div v-if="sections.length === 2" class="flex flex-wrap items-start gap-2">
                      <div class="flex flex-wrap items-center gap-2">
                        <Ball
                          v-for="number in sections[0].numbers"
                          :key="`${sections[0].key}-${group.id}-${number}`"
                          :num="formatBallNumber(number)"
                          :color="getNumberColor(group, number)"
                        />
                      </div>
                      <div class="self-center text-sm font-medium">/</div>
                      <div class="flex flex-wrap items-center gap-2">
                        <Ball
                          v-for="number in sections[1].numbers"
                          :key="`${sections[1].key}-${group.id}-${number}`"
                          :num="formatBallNumber(number)"
                          :color="getNumberColor(group, number)"
                        />
                      </div>
                    </div>
                    <div v-else class="flex flex-wrap items-center gap-2">
                      <Ball
                        v-for="number in sections[0].numbers"
                        :key="`${sections[0].key}-${group.id}-${number}`"
                        :num="formatBallNumber(number)"
                        :color="getNumberColor(group, number)"
                      />
                    </div>
                  </template>
                </div>

                <div v-if="group.settlement" class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-base-content/70">
                  <span>
                    中奖 {{ group.settlement.winningStakeCount }} 注 /
                    已确认 ¥{{ formatMoney(group.settlement.prizeAmount) }}
                  </span>
                  <span :class="getRevenueClass(group.settlement.revenue)">
                    营收 ¥{{ formatMoney(group.settlement.revenue) }}
                  </span>
                </div>
                <div
                  v-if="group.settlement?.hasUnconfirmedPrize"
                  class="text-sm text-warning"
                >
                  <p
                    v-for="entry in group.settlement.unconfirmedPrizeHits"
                    :key="`${group.id}-${entry.playType}-${entry.hitCount}`"
                    class="m-0"
                  >
                    {{ getPlayLabel(entry.playType) }}中{{ entry.hitCount }}：{{ entry.notice }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </LoDrawer>
</template>
