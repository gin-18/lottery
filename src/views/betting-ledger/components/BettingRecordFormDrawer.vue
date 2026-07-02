<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import Ball from '@/components/content/Ball.vue'
import DetailDescriptions from '@/components/content/DetailDescriptions.vue'
import LoDrawer from '@/components/content/LoDrawer.vue'
import {
  buildIssueOptions,
  createEmptyForm,
  createEmptyGroup,
  createEmptyItem,
  DANTUO_MODE,
  getIssueOptionValue,
  parseIssueOption,
  SINGLE_MODE,
} from '@/views/betting-ledger/utils/betting-record-form-draft'
import {
  calculateDraftTotals,
  calculateItemDraftTotals,
  validateBetDraft,
} from '@/stores/betting-ledger/betting-ledger-model'
import {
  PLAY_TYPES,
  SELECTION_MODES,
  getPlayLabel,
  getSelectionModeLabel,
} from '@/utils/lottery-rules'

const allNumbers = Array.from({ length: 80 }, (_, index) => index + 1)
const HIGHLIGHT_DURATION_MS = 1200
const ITEM_SCROLL_MARGIN = 8
const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)'
const createId = () => crypto.randomUUID()

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  editingRecord: {
    type: [Object, null],
    required: true,
  },
  recentDraws: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['submit', 'update:isOpen'])

const form = reactive(createEmptyForm(createId))
const highlightedItemId = ref(null)

const formErrors = computed(() => validateBetDraft(getDraft()))
const canSubmit = computed(() => formErrors.value.length === 0)
const draftTotals = computed(() => calculateDraftTotals(getDraft()))
const totalDetailItems = computed(() => getTotalDetailItems(draftTotals.value, form.items.length))
const issueOptions = computed(() => getIssueOptions())

const itemSectionElements = new Map()
const itemPlayTypeElements = new Map()
let highlightTimeoutId = null

watch(
  [() => props.isOpen, () => props.editingRecord],
  ([isOpen]) => {
    if (!isOpen) return
    syncFormFromProps()
  },
  { immediate: true },
)

function syncFormFromProps() {
  if (props.editingRecord) {
    applyForm(createFormFromRecord(props.editingRecord))
    return
  }

  applyForm(createEmptyForm(createId))
}

function createFormFromRecord(record) {
  return {
    issueOption: record.issueOption || getIssueOptionValue(record.issue, record.betDate),
    issue: record.issue,
    betDate: record.betDate,
    items: record.items.map((item) => ({
      id: item.id,
      playType: item.playType,
      selectionMode: item.selectionMode,
      multiplier: item.multiplier,
      numberGroups: item.numberGroups.map((group) => ({
        id: group.id,
        numbers: [...group.numbers],
        bankerNumbers: [...group.bankerNumbers],
        dragNumbers: [...group.dragNumbers],
      })),
    })),
  }
}

function applyForm(nextForm) {
  form.issueOption = nextForm.issueOption
  form.issue = nextForm.issue
  form.betDate = nextForm.betDate
  form.items = nextForm.items
}

function getDraft() {
  return {
    issueOption: form.issueOption,
    issue: form.issue,
    betDate: form.betDate,
    items: form.items.map((item) => ({
      id: item.id,
      playType: item.playType,
      selectionMode: item.selectionMode,
      multiplier: Number(item.multiplier),
      numberGroups: item.numberGroups.map((group) => ({
        id: group.id,
        numbers: [...group.numbers],
        bankerNumbers: [...group.bankerNumbers],
        dragNumbers: [...group.dragNumbers],
      })),
    })),
  }
}

function handleSubmit() {
  emit('submit', getDraft())
}

function handleDrawerChange(value) {
  emit('update:isOpen', value)
}

function resetForm() {
  syncFormFromProps()
}

function addItem() {
  const newItem = createEmptyItem(createId)

  form.items = [...form.items, newItem]
  revealAddedItem(newItem.id)
}

function removeItem(itemId) {
  if (form.items.length === 1) return
  form.items = form.items.filter((item) => item.id !== itemId)
}

function addSingleGroup(itemId) {
  const item = getItemById(itemId)
  if (!item || item.selectionMode !== SINGLE_MODE) return
  item.numberGroups = [...item.numberGroups, createEmptyGroup(createId)]
}

function removeGroup(itemId, groupId) {
  const item = getItemById(itemId)
  if (!item || item.numberGroups.length === 1) return
  item.numberGroups = item.numberGroups.filter((group) => group.id !== groupId)
}

function getItemById(itemId) {
  return form.items.find((item) => item.id === itemId)
}

function setItemSectionRef(itemId, element) {
  syncItemElement(itemSectionElements, itemId, element)
}

function setItemPlayTypeRef(itemId, element) {
  syncItemElement(itemPlayTypeElements, itemId, element)
}

function syncItemElement(elementMap, itemId, element) {
  if (element instanceof HTMLElement) {
    elementMap.set(itemId, element)
    return
  }

  elementMap.delete(itemId)
}

function handleSelectionModeChange(item) {
  item.numberGroups = [createEmptyGroup(createId)]
}

function toggleGroupNumber(group, fieldName, number) {
  const numbers = group[fieldName]

  if (numbers.includes(number)) {
    group[fieldName] = numbers.filter((itemNumber) => itemNumber !== number)
    return
  }

  removeDantuoConflict(group, fieldName, number)
  group[fieldName] = [...numbers, number].sort((first, second) => first - second)
}

function removeDantuoConflict(group, fieldName, number) {
  if (fieldName === 'bankerNumbers') {
    group.dragNumbers = group.dragNumbers.filter((itemNumber) => itemNumber !== number)
  }
  if (fieldName === 'dragNumbers') {
    group.bankerNumbers = group.bankerNumbers.filter((itemNumber) => itemNumber !== number)
  }
}

function isGroupNumberSelected(group, fieldName, number) {
  return group[fieldName].includes(number)
}

function getItemTotals(item) {
  return calculateItemDraftTotals({
    playType: item.playType,
    selectionMode: item.selectionMode,
    multiplier: Number(item.multiplier),
    numberGroups: item.numberGroups,
  })
}

function formatMoney(amount) {
  return Number(amount).toFixed(2)
}

function getTotalDetailItems(totals, itemCount) {
  return [
    { key: 'itemCount', label: '投注项', value: `${itemCount} 个` },
    { key: 'totalStakeCount', label: '总注数', value: `${totals.totalStakeCount} 注` },
    { key: 'totalStakeAmount', label: '投注成本', value: `¥${formatMoney(totals.totalStakeAmount)}` },
  ]
}

function handleIssueOptionChange(value) {
  const selectedIssue = parseIssueOption(value)

  form.issueOption = value
  form.issue = selectedIssue.issue
  form.betDate = selectedIssue.betDate
}

function getIssueOptions() {
  return buildIssueOptions(props.recentDraws, form.issueOption)
}

async function revealAddedItem(itemId) {
  await nextTick()
  scrollAddedItemIntoView(itemId)
  focusAddedItemPlayType(itemId)
  highlightAddedItem(itemId)
}

function scrollAddedItemIntoView(itemId) {
  const itemSection = itemSectionElements.get(itemId)
  const scrollContainer = itemSection?.closest('main')

  if (!(itemSection instanceof HTMLElement) || !(scrollContainer instanceof HTMLElement)) return

  const nextScrollTop = getNextScrollTop(scrollContainer, itemSection)

  if (nextScrollTop === null) return

  scrollContainer.scrollTo({
    top: nextScrollTop,
    behavior: getScrollBehavior(),
  })
}

function getNextScrollTop(scrollContainer, itemSection) {
  const itemTop = getItemTop(scrollContainer, itemSection)
  const itemBottom = itemTop + itemSection.offsetHeight
  const visibleTop = scrollContainer.scrollTop
  const visibleBottom = visibleTop + scrollContainer.clientHeight

  if (itemTop >= visibleTop && itemBottom <= visibleBottom) return null
  if (itemTop >= visibleBottom) return Math.max(itemTop - ITEM_SCROLL_MARGIN, 0)

  return Math.max(itemBottom - scrollContainer.clientHeight + ITEM_SCROLL_MARGIN, 0)
}

function getItemTop(scrollContainer, itemSection) {
  const containerRect = scrollContainer.getBoundingClientRect()
  const itemRect = itemSection.getBoundingClientRect()

  return scrollContainer.scrollTop + itemRect.top - containerRect.top
}

function getScrollBehavior() {
  return shouldReduceMotion() ? 'auto' : 'smooth'
}

function focusAddedItemPlayType(itemId) {
  const playTypeSelect = itemPlayTypeElements.get(itemId)

  if (!(playTypeSelect instanceof HTMLElement)) return

  playTypeSelect.focus({ preventScroll: true })
}

function highlightAddedItem(itemId) {
  clearHighlightTimeout()
  if (shouldReduceMotion()) return

  highlightedItemId.value = itemId
  highlightTimeoutId = window.setTimeout(() => {
    highlightedItemId.value = null
    highlightTimeoutId = null
  }, HIGHLIGHT_DURATION_MS)
}

function clearHighlightTimeout() {
  if (highlightTimeoutId === null) return

  window.clearTimeout(highlightTimeoutId)
  highlightTimeoutId = null
  highlightedItemId.value = null
}

function shouldReduceMotion() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED_MOTION_MEDIA_QUERY).matches
}

onBeforeUnmount(() => {
  clearHighlightTimeout()
})
</script>

<template>
  <LoDrawer
    :model-value="isOpen"
    :title="editingRecord ? '编辑投注' : '新增投注'"
    panel-class="md:w-1/3 lg:w-1/4"
    @update:model-value="handleDrawerChange"
  >
    <form id="betting-record-form" class="grid gap-4" @submit.prevent="handleSubmit">
      <div class="grid gap-4 md:grid-cols-3">
        <fieldset class="fieldset w-full">
          <legend class="fieldset-legend">投注期次</legend>
          <select
            :value="form.issueOption"
            class="select select-bordered w-full"
            @change="handleIssueOptionChange($event.target.value)"
          >
            <option value="">选择投注期次</option>
            <option v-for="option in issueOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </fieldset>
      </div>

      <div class="grid gap-4">
        <section
          v-for="(item, itemIndex) in form.items"
          :key="item.id"
          :ref="(element) => setItemSectionRef(item.id, element)"
          class="grid gap-4 rounded-box border border-base-300 p-4"
          :class="{ 'border-primary bg-primary/5': highlightedItemId === item.id }"
        >
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="grid gap-2">
              <div class="font-medium">投注项 {{ itemIndex + 1 }}</div>
              <div class="text-sm text-base-content/70">
                {{ getPlayLabel(item.playType) }} / {{ getSelectionModeLabel(item.selectionMode) }}
              </div>
            </div>
            <button
              class="btn btn-xs btn-error"
              type="button"
              :disabled="form.items.length === 1"
              @click="removeItem(item.id)"
            >
              删除投注项
            </button>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <fieldset class="fieldset w-full">
              <legend class="fieldset-legend">玩法</legend>
              <select
                v-model="item.playType"
                :ref="(element) => setItemPlayTypeRef(item.id, element)"
                class="select select-bordered w-full"
              >
                <option v-for="playType in PLAY_TYPES" :key="playType.value" :value="playType.value">
                  {{ playType.label }}
                </option>
              </select>
            </fieldset>

            <fieldset class="fieldset w-full">
              <legend class="fieldset-legend">选号结构</legend>
              <select
                v-model="item.selectionMode"
                class="select select-bordered w-full"
                @change="handleSelectionModeChange(item)"
              >
                <option
                  v-for="selectionMode in SELECTION_MODES"
                  :key="selectionMode.value"
                  :value="selectionMode.value"
                >
                  {{ selectionMode.label }}
                </option>
              </select>
            </fieldset>

            <fieldset class="fieldset w-full">
              <legend class="fieldset-legend">倍数</legend>
              <input v-model.number="item.multiplier" type="number" min="1" class="input input-bordered w-full" />
            </fieldset>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="text-sm text-base-content/70">
              {{ item.numberGroups.length }} 组号码 / {{ getItemTotals(item).stakeCount }} 注 /
              ¥{{ formatMoney(getItemTotals(item).stakeAmount) }}
            </div>
            <button
              v-if="item.selectionMode === SINGLE_MODE"
              class="btn btn-xs btn-primary"
              type="button"
              @click="addSingleGroup(item.id)"
            >
              添加号码组
            </button>
          </div>

          <div class="grid gap-4">
            <section
              v-for="(group, groupIndex) in item.numberGroups"
              :key="group.id"
              class="grid gap-4 rounded-box border border-base-300 p-4"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="text-sm font-medium">号码组 {{ groupIndex + 1 }}</div>
                <button
                  class="btn btn-xs btn-error"
                  type="button"
                  :disabled="item.numberGroups.length === 1"
                  @click="removeGroup(item.id, group.id)"
                >
                  删除号码组
                </button>
              </div>

              <div v-if="item.selectionMode !== DANTUO_MODE" class="grid gap-4">
                <div class="grid grid-cols-10 gap-2 md:grid-cols-[repeat(10,minmax(0,1fr))]">
                  <button
                    v-for="number in allNumbers"
                    :key="`${group.id}-${number}`"
                    type="button"
                    @click="toggleGroupNumber(group, 'numbers', number)"
                  >
                    <Ball
                      :num="String(number).padStart(2, '0')"
                      :color="{
                        'bg-base-300': true,
                        'bg-error': isGroupNumberSelected(group, 'numbers', number),
                      }"
                    />
                  </button>
                </div>
              </div>

              <div v-else class="grid gap-4">
                <div class="grid gap-4">
                  <div class="text-sm font-medium">胆码</div>
                  <div class="grid grid-cols-10 gap-2 md:grid-cols-[repeat(20,minmax(0,1fr))]">
                    <button
                      v-for="number in allNumbers"
                      :key="`banker-${group.id}-${number}`"
                      type="button"
                      @click="toggleGroupNumber(group, 'bankerNumbers', number)"
                    >
                      <Ball
                        :num="String(number).padStart(2, '0')"
                        :color="{
                          'bg-base-300': true,
                          'bg-error': isGroupNumberSelected(group, 'bankerNumbers', number),
                        }"
                      />
                    </button>
                  </div>
                </div>

                <div class="grid gap-4">
                  <div class="text-sm font-medium">拖码</div>
                  <div class="grid grid-cols-10 gap-2 md:grid-cols-[repeat(20,minmax(0,1fr))]">
                    <button
                      v-for="number in allNumbers"
                      :key="`drag-${group.id}-${number}`"
                      type="button"
                      @click="toggleGroupNumber(group, 'dragNumbers', number)"
                    >
                      <Ball
                        :num="String(number).padStart(2, '0')"
                        :color="{
                          'bg-base-300': true,
                          'bg-error': isGroupNumberSelected(group, 'dragNumbers', number),
                        }"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>

      <DetailDescriptions bordered :items="totalDetailItems" :columns="1" />

      <ul v-if="formErrors.length" class="m-0 text-sm text-error">
        <li v-for="item in formErrors" :key="item">{{ item }}</li>
      </ul>

    </form>

    <template #footer>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <button class="btn btn-sm btn-primary" type="button" @click="addItem">
          <span class="icon-[octicon--plus-16]"></span>
          添加投注项
        </button>
        <div class="flex items-center gap-2">
          <button class="btn btn-sm" type="button" @click="resetForm">重置</button>
          <button
            class="btn btn-sm btn-primary"
            type="submit"
            form="betting-record-form"
            :disabled="!canSubmit"
          >
            保存
          </button>
        </div>
      </div>
    </template>
  </LoDrawer>
</template>
